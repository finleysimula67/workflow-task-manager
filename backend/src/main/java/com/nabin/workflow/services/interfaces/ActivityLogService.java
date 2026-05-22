package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.response.ActivityResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ActivityLogService {

    void logActivity(Long userId, Long taskId, String entityType, Long entityId,
                     String action, String summary, String details);

    void logActivity(String userEmail, Long taskId, String entityType, Long entityId,
                     String action, String summary, String details);

    Page<ActivityResponseDTO> getUserActivities(Long userId, Pageable pageable);

    List<ActivityResponseDTO> getRecentActivities(Long userId, int limit);

    List<ActivityResponseDTO> getRecentGlobalActivities(int limit);

    Page<ActivityResponseDTO> getTaskActivities(Long taskId, Pageable pageable);

    long getActivityCountSince(Long userId, java.time.LocalDateTime since);
}
