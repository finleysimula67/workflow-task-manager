package com.nabin.workflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceDTO {
    @NotBlank(message = "Type is required")
    private String type;

    @NotNull(message = "Enabled is required")
    private Boolean enabled;
}
