package com.nabin.workflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskTemplateRequestDTO {

    @NotBlank(message = "Template name is required")
    @Size(min = 1, max = 100)
    private String name;

    @Size(max = 200)
    private String titlePrefix;

    private String description;

    private String priority;

    private String categoryIds;
}
