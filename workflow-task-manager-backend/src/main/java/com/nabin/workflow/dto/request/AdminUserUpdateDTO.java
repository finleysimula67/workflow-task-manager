package com.nabin.workflow.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdateDTO {
    private String username;
    private String email;
    private Boolean enabled;
    private Set<String> roles;
}
