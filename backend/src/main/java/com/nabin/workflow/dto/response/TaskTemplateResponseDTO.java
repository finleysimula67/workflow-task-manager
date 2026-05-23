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
public class TaskTemplateResponseDTO {
    private Long id;
    private String name;
    private String titlePrefix;
    private String description;
    private String priority;
    private String categoryIds;
    private LocalDateTime createdAt;
}
