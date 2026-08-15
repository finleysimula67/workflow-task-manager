package com.nabin.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.nabin.workflow.entities.AuthProvider;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private Boolean enabled;
    private AuthProvider provider;
    private String providerId;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String profileImage;

    // Statistics
    private Long totalTasks;
    private Long completedTasks;
    private Long totalCategories;
}
