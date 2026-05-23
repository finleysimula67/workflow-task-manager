package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.request.AdminUserUpdateDTO;
import com.nabin.workflow.dto.request.ChangePasswordDTO;
import com.nabin.workflow.dto.request.ResetPasswordRequest;
import com.nabin.workflow.dto.request.UpdateProfileDTO;
import com.nabin.workflow.dto.request.UserRegistrationDTO;
import com.nabin.workflow.dto.response.UserProfileDTO;
import com.nabin.workflow.dto.response.UserResponseDTO;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserResponseDTO registerUser(UserRegistrationDTO registrationDTO);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO getUserByEmail(String email);
    UserResponseDTO getUserByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    UserResponseDTO updateUser(Long userId, @Valid UserRegistrationDTO updateDTO);
    UserResponseDTO updateUserByAdmin(Long userId, AdminUserUpdateDTO updateDTO);
    List<UserResponseDTO> getAllUsers();
    void deleteUser(Long userId);

    //Profile management methods
    UserProfileDTO getCurrentUserProfile();
    UserProfileDTO updateCurrentUserProfile(UpdateProfileDTO updateProfileDTO);
    void changePassword(ChangePasswordDTO changePasswordDTO);
    String uploadProfileImage(MultipartFile file);

    void verifyEmail(String token);
    void resendVerificationEmail(String email);
    void forgotPassword(String email);
    void resetPassword(ResetPasswordRequest request);
}
