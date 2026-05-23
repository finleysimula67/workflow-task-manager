package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.response.NotificationResponseDTO;
import com.nabin.workflow.entities.Notification;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.repository.NotificationRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.interfaces.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void createNotification(Long userId, String type, String title, String message,
                                   Long taskId, Long actorId, String actorName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .taskId(taskId)
                .actorId(actorId)
                .actorName(actorName)
                .build();

        notificationRepository.save(notification);
        log.debug("Notification created for user {}: {}", userId, type);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponseDTO> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getUnreadNotifications(Long userId) {
        return notificationRepository.findTop20ByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        int updated = notificationRepository.markAsRead(notificationId, userId);
        if (updated == 0) {
            throw new ResourceNotFoundException("Notification", "id", notificationId);
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    private NotificationResponseDTO toDTO(Notification notification) {
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .taskId(notification.getTaskId())
                .actorId(notification.getActorId())
                .actorName(notification.getActorName())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
