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
public class CategoryResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String color;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}