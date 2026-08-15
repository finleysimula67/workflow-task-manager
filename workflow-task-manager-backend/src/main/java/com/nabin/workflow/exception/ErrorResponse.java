package com.nabin.workflow.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
// Only include non-null fields in JSON
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    // Field-level validation errors (only for validation failures)
    private Map<String, String> fieldErrors;

    // Additional debug info (can be used in development)
    private String debugMessage;
}