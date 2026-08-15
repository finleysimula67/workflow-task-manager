package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.request.*;
import com.nabin.workflow.dto.response.LoginResponseDTO;
import com.nabin.workflow.dto.response.RefreshTokenResponse;
import com.nabin.workflow.dto.response.UserResponseDTO;
import com.nabin.workflow.entities.RefreshToken;
import com.nabin.workflow.security.user.AuthenticationService;
import com.nabin.workflow.security.jwt.JwtTokenProvider;
import com.nabin.workflow.util.SecurityUtil;
import com.nabin.workflow.security.user.UserPrincipal;
import com.nabin.workflow.services.RefreshTokenService;
import com.nabin.workflow.services.interfaces.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final RefreshTokenService refreshTokenService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> registerUser(
            @Valid @RequestBody UserRegistrationDTO registrationDTO) {

        log.info("Registration request for email: {}", registrationDTO.getEmail());

        UserResponseDTO user = userService.registerUser(registrationDTO);

        ApiResponse<UserResponseDTO> response = ApiResponse.success(
                "User registered successfully. Please login to continue.",
                user
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Login user (returns access token + refresh token)
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> loginUser(
            @Valid @RequestBody UserLoginDTO loginDTO,
            HttpServletRequest request) {

        log.info("Login request for email: {}", loginDTO.getEmail());

        LoginResponseDTO loginResponse = authenticationService.authenticateUser(loginDTO, request);

        ApiResponse<LoginResponseDTO> response = ApiResponse.success(
                "Login successful",
                loginResponse
        );

        return ResponseEntity.ok(response);
    }

    /**
     * NEW: Refresh access token using refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest) {

        log.info("Token refresh request received");

        // Verify refresh token
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());

        // Generate new access token
        UserPrincipal userPrincipal = UserPrincipal.build(refreshToken.getUser());
        String newAccessToken = jwtTokenProvider.generateTokenFromUserPrincipal(userPrincipal);

        //  Rotate refresh token (security best practice)
        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshToken, httpRequest);

        RefreshTokenResponse tokenResponse = RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .type("Bearer")
                .build();

        log.info("Tokens refreshed successfully for user: {}", refreshToken.getUser().getId());

        ApiResponse<RefreshTokenResponse> response = ApiResponse.success(
                "Tokens refreshed successfully",
                tokenResponse
        );

        return ResponseEntity.ok(response);
    }

    /**
     * NEW: Logout (revoke refresh token)
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @Valid @RequestBody RefreshTokenRequest request) {

        log.info("Logout request received");

        try {
            // Revoke the refresh token
            refreshTokenService.revokeRefreshToken(request.getRefreshToken());

            log.info("User logged out successfully");

            ApiResponse<Void> response = ApiResponse.success(
                    "Logged out successfully"
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.warn("Logout attempt with invalid token");

            // Even if token is invalid, return success (security best practice)
            ApiResponse<Void> response = ApiResponse.success(
                    "Logged out successfully"
            );

            return ResponseEntity.ok(response);
        }
    }

    /**
     * NEW: Logout from all devices
     */
    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Void>> logoutAll() {
        log.info("Logout all devices request received");

        Long userId = SecurityUtil.getCurrentUserId();
        refreshTokenService.revokeAllUserTokens(userId);

        log.info("User logged out from all devices: {}", userId);

        ApiResponse<Void> response = ApiResponse.success(
                "Logged out from all devices successfully"
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Check if email exists
     */
    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);

        ApiResponse<Boolean> response = ApiResponse.success(
                exists ? "Email is already registered" : "Email is available",
                exists
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Check if username exists
     */
    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Boolean>> checkUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);

        ApiResponse<Boolean> response = ApiResponse.success(
                exists ? "Username is already taken" : "Username is available",
                exists
        );

        return ResponseEntity.ok(response);
    }
    /**
     * Verify email
     */
    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        log.info("📧 Email verification request");

        userService.verifyEmail(token);

        ApiResponse<Void> response = ApiResponse.success(
                "Email verified successfully! You can now login."
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Resend verification email
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(
            @RequestParam String email) {

        log.info("📧 Resend verification request for: {}", email);

        userService.resendVerificationEmail(email);

        ApiResponse<Void> response = ApiResponse.success(
                "Verification email sent! Please check your inbox."
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Forgot password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        log.info("🔑 Password reset request for: {}", request.getEmail());

        userService.forgotPassword(request.getEmail());

        ApiResponse<Void> response = ApiResponse.success(
                "Password reset email sent! Please check your inbox."
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Reset password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        log.info("Password reset confirmation");

        userService.resetPassword(request);

        ApiResponse<Void> response = ApiResponse.success(
                "Password reset successfully! You can now login with your new password."
        );

        return ResponseEntity.ok(response);
    }
}