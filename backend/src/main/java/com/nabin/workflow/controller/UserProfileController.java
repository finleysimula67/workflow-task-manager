package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.request.ChangePasswordDTO;
import com.nabin.workflow.dto.request.NotificationPreferenceDTO;
import com.nabin.workflow.dto.request.UpdateProfileDTO;
import com.nabin.workflow.dto.response.NotificationPreferenceResponseDTO;
import com.nabin.workflow.dto.response.UserProfileDTO;
import com.nabin.workflow.services.interfaces.NotificationPreferenceService;
import com.nabin.workflow.services.interfaces.UserService;
import com.nabin.workflow.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserProfileController {

    private final UserService userService;
    private final NotificationPreferenceService notificationPreferenceService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getCurrentUserProfile() {
        log.info("Getting current user profile");

        UserProfileDTO profile = userService.getCurrentUserProfile();

        ApiResponse<UserProfileDTO> response = ApiResponse.success(
                "Profile retrieved successfully",
                profile
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateCurrentUserProfile(
            @Valid @RequestBody UpdateProfileDTO updateProfileDTO) {

        log.info("Updating current user profile");

        UserProfileDTO profile = userService.updateCurrentUserProfile(updateProfileDTO);

        ApiResponse<UserProfileDTO> response = ApiResponse.success(
                "Profile updated successfully",
                profile
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO) {

        log.info("Password change requested");

        userService.changePassword(changePasswordDTO);

        ApiResponse<Void> response = ApiResponse.success(
                "Password changed successfully. Please login again with your new password."
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/me/photo")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadProfilePhoto(
            @RequestParam("file") MultipartFile file) {

        log.info("Uploading profile photo");

        String profileImage = userService.uploadProfileImage(file);

        ApiResponse<Map<String, String>> response = ApiResponse.success(
                "Profile photo uploaded successfully",
                Map.of("profileImage", profileImage)
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile-image/{filename}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) {
        try {
            String uploadPath = System.getProperty("user.dir") + "/" + uploadDir + "/profiles";
            Path filePath = Paths.get(uploadPath).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = "image/jpeg";
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            log.error("Error serving profile image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/me/notification-preferences")
    public ResponseEntity<ApiResponse<List<NotificationPreferenceResponseDTO>>> getNotificationPreferences() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<NotificationPreferenceResponseDTO> prefs = notificationPreferenceService.getPreferences(userId);
        return ResponseEntity.ok(ApiResponse.success("Preferences retrieved", prefs));
    }

    @PutMapping("/me/notification-preferences")
    public ResponseEntity<ApiResponse<List<NotificationPreferenceResponseDTO>>> updateNotificationPreferences(
            @Valid @RequestBody List<NotificationPreferenceDTO> preferences) {
        Long userId = SecurityUtil.getCurrentUserId();
        List<NotificationPreferenceResponseDTO> prefs = notificationPreferenceService.updatePreferences(userId, preferences);
        return ResponseEntity.ok(ApiResponse.success("Preferences updated", prefs));
    }
}
