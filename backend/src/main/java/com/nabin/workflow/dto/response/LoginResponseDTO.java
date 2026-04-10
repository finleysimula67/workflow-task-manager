package com.nabin.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private String token;
    private String refreshToken;
    @Builder.Default
    private String type = "Bearer";

    private UserResponseDTO user;

    private LocalDateTime lastLoginAt;
}