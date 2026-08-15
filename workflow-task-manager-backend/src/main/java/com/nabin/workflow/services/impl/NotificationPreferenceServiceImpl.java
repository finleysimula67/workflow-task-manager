package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.request.NotificationPreferenceDTO;
import com.nabin.workflow.dto.response.NotificationPreferenceResponseDTO;
import com.nabin.workflow.entities.NotificationPreference;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.repository.NotificationPreferenceRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.interfaces.NotificationPreferenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationPreferenceServiceImpl implements NotificationPreferenceService {

    private final NotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationPreferenceResponseDTO> getPreferences(Long userId) {
        List<NotificationPreference> prefs = preferenceRepository.findByUserId(userId);
        return prefs.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<NotificationPreferenceResponseDTO> updatePreferences(Long userId, List<NotificationPreferenceDTO> preferences) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        for (NotificationPreferenceDTO dto : preferences) {
            NotificationPreference pref = preferenceRepository
                    .findByUserIdAndType(userId, dto.getType())
                    .orElseGet(() -> NotificationPreference.builder()
                            .user(user)
                            .type(dto.getType())
                            .build());
            pref.setEnabled(dto.getEnabled());
            preferenceRepository.save(pref);
        }

        return getPreferences(userId);
    }

    private NotificationPreferenceResponseDTO toDTO(NotificationPreference pref) {
        return NotificationPreferenceResponseDTO.builder()
                .id(pref.getId())
                .type(pref.getType())
                .enabled(pref.getEnabled())
                .build();
    }
}
