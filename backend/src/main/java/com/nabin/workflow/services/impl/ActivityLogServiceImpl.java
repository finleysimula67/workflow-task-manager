package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.response.ActivityResponseDTO;
import com.nabin.workflow.entities.ActivityLog;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.repository.ActivityLogRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.interfaces.ActivityLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @Override
    public void logActivity(Long userId, Long taskId, String entityType, Long entityId,
                            String action, String summary, String details) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        ActivityLog logEntry = ActivityLog.builder()
                .user(user)
                .taskId(taskId)
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .summary(summary)
                .details(details)
                .build();

        activityLogRepository.save(logEntry);
        log.debug("Activity logged: {} {} #{} by user {}", action, entityType, entityId, userId);
    }

    @Override
    public void logActivity(String userEmail, Long taskId, String entityType, Long entityId,
                            String action, String summary, String details) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        logActivity(user.getId(), taskId, entityType, entityId, action, summary, details);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityResponseDTO> getUserActivities(Long userId, Pageable pageable) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityResponseDTO> getRecentActivities(Long userId, int limit) {
        return activityLogRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .limit(limit)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityResponseDTO> getRecentGlobalActivities(int limit) {
        return activityLogRepository.findTop20ByOrderByCreatedAtDesc()
                .stream()
                .limit(limit)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityResponseDTO> getTaskActivities(Long taskId, Pageable pageable) {
        return activityLogRepository.findByTaskIdOrderByCreatedAtDesc(taskId, pageable)
                .map(this::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public long getActivityCountSince(Long userId, LocalDateTime since) {
        return activityLogRepository.countByUserIdAndCreatedAtAfter(userId, since);
    }

    private ActivityResponseDTO toDTO(ActivityLog log) {
        return ActivityResponseDTO.builder()
                .id(log.getId())
                .userId(log.getUser().getId())
                .username(log.getUser().getUsername())
                .userEmail(log.getUser().getEmail())
                .userProfileImage(log.getUser().getProfileImage())
                .taskId(log.getTaskId())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .action(log.getAction())
                .summary(log.getSummary())
                .details(log.getDetails())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
