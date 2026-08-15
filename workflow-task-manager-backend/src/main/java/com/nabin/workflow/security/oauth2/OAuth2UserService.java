package com.nabin.workflow.security.oauth2;

import com.nabin.workflow.entities.AuthProvider;
import com.nabin.workflow.entities.Role;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.repository.RoleRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.security.oauth2.user.OAuth2UserInfo;
import com.nabin.workflow.security.oauth2.user.OAuth2UserInfoFactory;
import com.nabin.workflow.security.user.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId(); // "google"

        log.info(" OAuth2 Login attempt - Provider: {}", provider);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            log.error(" Error processing OAuth2 user", ex);
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String provider = userRequest.getClientRegistration().getRegistrationId();

        // Extract user information based on provider
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(provider, oAuth2User.getAttributes());

        if (userInfo.getEmail() == null || userInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        log.info(" OAuth2 User - Email: {}, Name: {}", userInfo.getEmail(), userInfo.getName());

        // Find or create user
        User user = findOrCreateUser(userInfo, provider);

        return UserPrincipal.build(user);
    }

    private User findOrCreateUser(OAuth2UserInfo userInfo, String provider) {
        // Check if user exists by email
        Optional<User> existingUser = userRepository.findByEmail(userInfo.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // If user registered with email/password, update to OAuth
            if (user.getProvider() == AuthProvider.LOCAL) {
                log.info(" User exists with LOCAL provider, updating to {}", provider);
                user.setProvider(AuthProvider.valueOf(provider.toUpperCase()));
                user.setProviderId(userInfo.getId());
                return userRepository.save(user);
            }

            // If provider doesn't match, throw error
            if (!user.getProvider().name().equalsIgnoreCase(provider)) {
                throw new OAuth2AuthenticationException(
                        "Email already registered with " + user.getProvider() + " provider"
                );
            }

            log.info(" Existing OAuth user found: {}", userInfo.getEmail());
            return user;
        }

        // Create new user
        log.info(" Creating new OAuth user: {}", userInfo.getEmail());
        return createNewOAuthUser(userInfo, provider);
    }

    private User createNewOAuthUser(OAuth2UserInfo userInfo, String provider) {
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("ROLE_USER");
                    return roleRepository.save(newRole);
                });

        User newUser = User.builder()
                .username(userInfo.getName() != null ? userInfo.getName() : generateUsername(userInfo.getEmail()))
                .email(userInfo.getEmail())
                .password(null)  //  No password for OAuth users
                .enabled(true)
                .provider(AuthProvider.valueOf(provider.toUpperCase()))  //  Set provider
                .providerId(userInfo.getId())  // Set provider ID
                .build();

        newUser.setRoles(Set.of(userRole));

        User savedUser = userRepository.save(newUser);
        log.info(" New OAuth user created - ID: {}, Email: {}, Provider: {}",
                savedUser.getId(), savedUser.getEmail(), savedUser.getProvider());

        return savedUser;
    }

    private String generateUsername(String email) {
        String baseUsername = email.split("@")[0].replace(".", "_");

        if (!userRepository.existsByUsername(baseUsername)) {
            return baseUsername;
        }

        int counter = 1;
        String username = baseUsername + counter;
        while (userRepository.existsByUsername(username)) {
            counter++;
            username = baseUsername + counter;
        }

        return username;
    }
    /**
     * MERGING LOGIC: Update existing user with OAuth info
     */
    private User updateExistingUser(User user, OAuth2UserInfo userInfo, String provider) {
        AuthProvider newProvider = AuthProvider.valueOf(provider.toUpperCase());

        log.info("Existing user found: {}", userInfo.getEmail());
        log.info("Current provider: {}, New provider: {}", user.getProvider(), newProvider);

        // Scenario 1: User registered with LOCAL, now using Google OAuth
        if (user.getProvider() == AuthProvider.LOCAL && newProvider == AuthProvider.GOOGLE) {
            log.info("🔗 Merging LOCAL user with GOOGLE account");

            // Update to GOOGLE provider but keep the local password
            // This allows user to login with BOTH methods
            user.setProvider(AuthProvider.GOOGLE);
            user.setProviderId(userInfo.getId());

            User savedUser = userRepository.save(user);
            log.info("Account merged - User can now login with email/password OR Google");
            return savedUser;
        }

        // Scenario 2: User already using same OAuth provider
        if (user.getProvider() == newProvider) {
            log.info("User already using {} provider", provider);

            // Update provider ID if changed
            if (!userInfo.getId().equals(user.getProviderId())) {
                user.setProviderId(userInfo.getId());
                return userRepository.save(user);
            }

            return user;
        }

        // Scenario 3: User using different OAuth provider (Google vs Facebook, etc.)
        if (user.getProvider() != AuthProvider.LOCAL) {
            log.error("Email already registered with {} provider", user.getProvider());
            throw new OAuth2AuthenticationException(
                    "Email already registered with " + user.getProvider() + " provider. " +
                            "Please use " + user.getProvider() + " to login."
            );
        }

        return user;
    }
}