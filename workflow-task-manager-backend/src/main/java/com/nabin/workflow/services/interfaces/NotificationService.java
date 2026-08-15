package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.response.NotificationResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    void createNotification(Long userId, String type, String title, String message,
                            Long taskId, Long actorId, String actorName);

    Page<NotificationResponseDTO> getUserNotifications(Long userId, Pageable pageable);

    List<NotificationResponseDTO> getUnreadNotifications(Long userId);

    long getUnreadCount(Long userId);

    void markAsRead(Long notificationId, Long userId);

    void markAllAsRead(Long userId);
}
