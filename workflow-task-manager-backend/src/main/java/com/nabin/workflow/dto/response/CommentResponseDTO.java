package com.nabin.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private String content;
    private Long taskId;
    private Long userId;
    private String username;
    private String userEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isEdited;
}