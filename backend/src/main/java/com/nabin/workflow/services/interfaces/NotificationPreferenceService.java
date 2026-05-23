package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.request.NotificationPreferenceDTO;
import com.nabin.workflow.dto.response.NotificationPreferenceResponseDTO;

import java.util.List;

public interface NotificationPreferenceService {
    List<NotificationPreferenceResponseDTO> getPreferences(Long userId);
    List<NotificationPreferenceResponseDTO> updatePreferences(Long userId, List<NotificationPreferenceDTO> preferences);
}
