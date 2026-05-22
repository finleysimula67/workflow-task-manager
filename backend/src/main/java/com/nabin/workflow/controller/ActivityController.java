package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.response.ActivityResponseDTO;
import com.nabin.workflow.services.interfaces.ActivityLogService;
import com.nabin.workflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Slf4j
public class ActivityController {

    private final ActivityLogService activityLogService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<ActivityResponseDTO>>> getUserActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = SecurityUtil.getCurrentUserId();
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ActivityResponseDTO> activities = activityLogService.getUserActivities(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Activities retrieved successfully", activities));
    }

    @GetMapping("/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ActivityResponseDTO>>> getRecentActivities(
            @RequestParam(defaultValue = "10") int limit) {
        Long userId = SecurityUtil.getCurrentUserId();
        List<ActivityResponseDTO> activities = activityLogService.getRecentActivities(userId, limit);
        return ResponseEntity.ok(ApiResponse.success("Recent activities retrieved successfully", activities));
    }

    @GetMapping("/task/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<ActivityResponseDTO>>> getTaskActivities(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ActivityResponseDTO> activities = activityLogService.getTaskActivities(taskId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Task activities retrieved successfully", activities));
    }
}
