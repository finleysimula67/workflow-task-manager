package com.nabin.workflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDTO {

    @NotBlank(message = "Comment content cannot be empty")
    @Size(max = 5000, message = "Comment cannot exceed 5000 characters")
    private String content;
}