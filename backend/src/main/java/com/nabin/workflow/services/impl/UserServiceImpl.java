package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.request.AdminUserUpdateDTO;
import com.nabin.workflow.dto.request.ChangePasswordDTO;
import com.nabin.workflow.dto.request.ResetPasswordRequest;
import com.nabin.workflow.dto.request.UpdateProfileDTO;
import com.nabin.workflow.dto.request.UserRegistrationDTO;
import com.nabin.workflow.dto.response.UserProfileDTO;
import com.nabin.workflow.dto.response.UserResponseDTO;
import com.nabin.workflow.entities.*;
import com.nabin.workflow.exception.DuplicateResourceException;
import com.nabin.workflow.exception.InvalidBusinessRuleException;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.exception.UnauthorizedException;
import com.nabin.workflow.mapper.DTOMapper;
import com.nabin.workflow.repository.*;
import com.nabin.workflow.services.EmailService;
import com.nabin.workflow.util.SecurityUtil;
import com.nabin.workflow.services.interfaces.ActivityLogService;
import com.nabin.workflow.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DTOMapper dtoMapper;
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;

    @Value("${app.verification.token-expiration}")
    private Long verificationTokenExpiration;

    @Value("${app.password-reset.token-expiration}")
    private Long passwordResetTokenExpiration;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    @Transactional
    public UserResponseDTO registerUser(UserRegistrationDTO registrationDTO) {
        log.info("Registering new user: {}", registrationDTO.getEmail());

        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            log.warn("Registration failed: Email already exists - {}", registrationDTO.getEmail());
            throw new DuplicateResourceException("Email", registrationDTO.getEmail());
        }

        if (userRepository.existsByUsername(registrationDTO.getUsername())) {
            log.warn("Registration failed: Username already exists - {}", registrationDTO.getUsername());
            throw new DuplicateResourceException("Username", registrationDTO.getUsername());
        }

        validateUserBusinessRules(registrationDTO);

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> {
                    log.info("ROLE_USER not found, creating new role");
                    Role newRole = new Role();
                    newRole.setName("ROLE_USER");
                    return roleRepository.save(newRole);
                });

        User user = User.builder()
                .username(registrationDTO.getUsername())
                .email(registrationDTO.getEmail())
                .password(passwordEncoder.encode(registrationDTO.getPassword()))
                .enabled(false)
                .provider(AuthProvider.LOCAL)
                .providerId(null)
                .build();

        user.setRoles(Set.of(userRole));

        User savedUser = userRepository.save(user);
        createVerificationToken(savedUser);

        log.info("User registered successfully - ID: {}, Email: {}", savedUser.getId(), savedUser.getEmail());

        activityLogService.logActivity(savedUser.getId(), null, "User", savedUser.getId(),
                "REGISTERED", "User registered: " + savedUser.getEmail(), null);

        return dtoMapper.toUserResponseDTO(savedUser);
    }

    private void createVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(verificationTokenExpiration / 1000);

        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiryDate(expiryDate)
                .verified(false)
                .build();

        verificationTokenRepository.save(verificationToken);
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), token);

        log.info("Verification token created and email sent to: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));

        if (verificationToken.isExpired()) {
            throw new IllegalArgumentException("Verification token has expired");
        }

        if (verificationToken.getVerified()) {
            throw new IllegalArgumentException("Email already verified");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        verificationToken.setVerified(true);
        verificationTokenRepository.save(verificationToken);

        log.info("Email verified successfully for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (user.getEnabled()) {
            throw new IllegalArgumentException("Email already verified");
        }

        verificationTokenRepository.findByUser(user).ifPresent(verificationTokenRepository::delete);
        createVerificationToken(user);

        log.info("Verification email resent to: {}", email);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(passwordResetTokenExpiration / 1000);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(expiryDate)
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), token);

        log.info("Password reset email sent to: {}", email);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid reset token"));

        if (resetToken.isExpired()) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        if (resetToken.getUsed()) {
            throw new IllegalArgumentException("Reset token already used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public UserProfileDTO getCurrentUserProfile() {
        Long userId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        long totalTasks = taskRepository.countByUserId(userId);
        long completedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
        long totalCategories = categoryRepository.countByUserId(userId);

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .provider(user.getProvider())
                .providerId(user.getProviderId())
                .roles(roleNames)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .profileImage(user.getProfileImage())
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .totalCategories(totalCategories)
                .build();
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public UserProfileDTO updateCurrentUserProfile(UpdateProfileDTO updateProfileDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        log.info("Updating profile for user: {}", user.getEmail());

        if (updateProfileDTO.getUsername() != null && !updateProfileDTO.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateProfileDTO.getUsername())) {
                throw new DuplicateResourceException("Username", updateProfileDTO.getUsername());
            }
            user.setUsername(updateProfileDTO.getUsername());
            log.info("Username updated to: {}", updateProfileDTO.getUsername());
        }

        if (updateProfileDTO.getEmail() != null && !updateProfileDTO.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateProfileDTO.getEmail())) {
                throw new DuplicateResourceException("Email", updateProfileDTO.getEmail());
            }
            user.setEmail(updateProfileDTO.getEmail());
            log.info("Email updated to: {}", updateProfileDTO.getEmail());
        }

        userRepository.save(user);
        log.info("Profile updated successfully for user: {}", userId);

        return getCurrentUserProfile();
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void changePassword(ChangePasswordDTO changePasswordDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new IllegalArgumentException("Cannot change password for OAuth users.");
        }

        if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
            log.warn("Password change failed: Incorrect current password for user {}", userId);
            throw new UnauthorizedException("Current password is incorrect");
        }

        if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        if (passwordEncoder.matches(changePasswordDTO.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", userId);
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public String uploadProfileImage(MultipartFile file) {
        Long userId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        if (file.getSize() > 30 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 30MB limit");
        }

        try {
            String uploadPath = System.getProperty("user.dir") + "/" + uploadDir + "/profiles";
            Path uploadDirPath = Paths.get(uploadPath);

            if (!Files.exists(uploadDirPath)) {
                Files.createDirectories(uploadDirPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = "user_" + userId + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadDirPath.resolve(newFilename);

            Files.write(filePath, file.getBytes());

            String imageUrl = "/api/files/profiles/" + newFilename;

            user.setProfileImage(imageUrl);
            userRepository.save(user);

            log.info("Profile image uploaded for user {}: {}", userId, imageUrl);

            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to upload profile image for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to upload profile image: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return dtoMapper.toUserResponseDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return dtoMapper.toUserResponseDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return dtoMapper.toUserResponseDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long userId, UserRegistrationDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!user.getUsername().equals(updateDTO.getUsername()) && userRepository.existsByUsername(updateDTO.getUsername())) {
            throw new DuplicateResourceException("Username", updateDTO.getUsername());
        }

        if (!user.getEmail().equals(updateDTO.getEmail()) && userRepository.existsByEmail(updateDTO.getEmail())) {
            throw new DuplicateResourceException("Email", updateDTO.getEmail());
        }

        user.setUsername(updateDTO.getUsername());
        user.setEmail(updateDTO.getEmail());

        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }

        userRepository.save(user);

        return dtoMapper.toUserResponseDTO(user);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponseDTO updateUserByAdmin(Long userId, AdminUserUpdateDTO updateDTO) {
        log.info("Admin updating user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (updateDTO.getUsername() != null) {
            if (!user.getUsername().equals(updateDTO.getUsername()) && userRepository.existsByUsername(updateDTO.getUsername())) {
                throw new DuplicateResourceException("Username", updateDTO.getUsername());
            }
            user.setUsername(updateDTO.getUsername());
        }

        if (updateDTO.getEmail() != null) {
            if (!user.getEmail().equals(updateDTO.getEmail()) && userRepository.existsByEmail(updateDTO.getEmail())) {
                throw new DuplicateResourceException("Email", updateDTO.getEmail());
            }
            user.setEmail(updateDTO.getEmail());
        }

        if (updateDTO.getEnabled() != null) {
            user.setEnabled(updateDTO.getEnabled());
        }

        if (updateDTO.getRoles() != null) {
            Set<Role> roles = updateDTO.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        userRepository.save(user);

        return dtoMapper.toUserResponseDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponseDTO> getAllUsers() {
        log.info("Getting all users");
        List<User> users = userRepository.findAll();
        return users.stream().map(dtoMapper::toUserResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long userId) {
        log.info("Attempting to delete user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Long currentUserId = SecurityUtil.getCurrentUserId();
        if (currentUserId.equals(userId)) {
            throw new IllegalArgumentException("Cannot delete your own account");
        }

        log.info("Deleting user: {} ({})", user.getEmail(), userId);

        try {
            refreshTokenRepository.deleteByUser(user);
            log.debug("Deleted refresh tokens for user: {}", userId);

            taskRepository.deleteByUserId(userId);
            log.debug("Deleted tasks for user: {}", userId);

            categoryRepository.deleteByUserId(userId);
            log.debug("Deleted categories for user: {}", userId);

            user.getRoles().clear();
            userRepository.saveAndFlush(user);

            userRepository.delete(user);
            log.info("User deleted successfully: {}", userId);

        } catch (Exception e) {
            log.error("Error deleting user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }

    private void validateUserBusinessRules(UserRegistrationDTO registrationDTO) {
        String[] reservedWords = {"admin", "root", "system", "administrator", "moderator"};
        String usernameLower = registrationDTO.getUsername().toLowerCase();

        for (String reserved : reservedWords) {
            if (usernameLower.contains(reserved)) {
                throw new InvalidBusinessRuleException("Username cannot contain reserved word: " + reserved);
            }
        }
    }

    @Scheduled(cron = "0 0 4 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Cleaning up expired tokens...");
        verificationTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        passwordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Expired tokens cleaned up");
    }
}
