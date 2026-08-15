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
public class TeamMemberResponseDTO {
    private Long id;
    private Long teamId;
    private Long userId;
    private String username;
    private String email;
    private String role;
    private LocalDateTime joinedAt;
}
