package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.response.UserResponseDTO;
import com.nabin.workflow.entities.TaskStatus;
import com.nabin.workflow.repository.TaskRepository;
import com.nabin.workflow.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserService userService;
    private final TaskRepository taskRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAllUsers() {
        log.info("Admin endpoint: Getting all users");

        var users = userService.getAllUsers();

        ApiResponse<?> response = ApiResponse.success(
                String.format("Retrieved %d users", users.size()),
                users
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Long id) {
        log.info("Admin endpoint: Getting user with ID: {}", id);

        var user = userService.getUserById(id);

        ApiResponse<?> response = ApiResponse.success(
                "User retrieved successfully",
                user
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getUserStats(@PathVariable Long id) {
        log.info("Admin endpoint: Getting stats for user ID: {}", id);

        long totalTasks = taskRepository.countByUserId(id);
        long todoTasks = taskRepository.countByUserIdAndStatus(id, TaskStatus.TODO);
        long inProgressTasks = taskRepository.countByUserIdAndStatus(id, TaskStatus.IN_PROGRESS);
        long completedTasks = taskRepository.countByUserIdAndStatus(id, TaskStatus.COMPLETED);

        var stats = Map.of(
                "totalTasks", totalTasks,
                "todoTasks", todoTasks,
                "inProgressTasks", inProgressTasks,
                "completedTasks", completedTasks
        );

        ApiResponse<?> response = ApiResponse.success(
                "User stats retrieved successfully",
                stats
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        log.warn("Admin endpoint: Deleting user with ID: {}", id);

        userService.deleteUser(id);

        ApiResponse<Void> response = ApiResponse.success(
                "User deleted successfully"
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tasks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> getAllTasksAdmin() {
        log.info("Admin endpoint: Getting all tasks (all users)");

        ApiResponse<String> response = ApiResponse.success(
                "Admin tasks endpoint - implementation pending",
                "This would return all tasks from all users"
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> testAdminAccess() {
        log.info("Admin endpoint: Test access");

        ApiResponse<String> response = ApiResponse.success(
                "Admin access granted!",
                "You have ADMIN role"
        );

        return ResponseEntity.ok(response);
    }
}
