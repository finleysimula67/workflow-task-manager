package com.nabin.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDTO {
    private Long id;
    private Long userId;
    private String username;
    private String userEmail;
    private String userProfileImage;
    private Long taskId;
    private String taskTitle;
    private String entityType;
    private Long entityId;
    private String action;
    private String summary;
    private String details;
    private LocalDateTime createdAt;
}
