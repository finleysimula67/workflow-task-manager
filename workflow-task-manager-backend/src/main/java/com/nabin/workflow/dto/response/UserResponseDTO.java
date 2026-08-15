package com.nabin.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private Set<RoleResponseDTO> roles;
    private String profileImage;
}