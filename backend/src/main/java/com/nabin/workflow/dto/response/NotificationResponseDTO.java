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
public class NotificationResponseDTO {
    private Long id;
    private String type;
    private String title;
    private String message;
    private Long taskId;
    private Long actorId;
    private String actorName;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
