package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.request.TaskFilterDTO;
import com.nabin.workflow.dto.request.TaskRequestDTO;
import com.nabin.workflow.dto.request.TaskUpdateDTO;
import com.nabin.workflow.dto.response.TaskResponseDTO;
import com.nabin.workflow.dto.response.TaskStatsDTO;
import com.nabin.workflow.entities.TaskStatus;
import com.nabin.workflow.services.interfaces.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    // -------------------------------------------------------
    // POST /api/tasks — Create task
    // -------------------------------------------------------
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(
            @Valid @RequestBody TaskRequestDTO taskDTO) {

        log.info("Creating new task: {}", taskDTO.getTitle());
        TaskResponseDTO task = taskService.createTask(taskDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Task created successfully", task),
                HttpStatus.CREATED
        );
    }

    /**
     * Get task statistics
     * GET /api/tasks/stats
     */
    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TaskStatsDTO>> getTaskStats() {
        log.info("Fetching task statistics");

        TaskStatsDTO stats = taskService.getTaskStats();

        ApiResponse<TaskStatsDTO> response = ApiResponse.success(
                "Task statistics retrieved successfully",
                stats
        );

        return ResponseEntity.ok(response);
    }

    // -------------------------------------------------------
    // GET /api/tasks — Get all tasks
    // -------------------------------------------------------
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getAllTasks() {
        log.info("Fetching all tasks for current user");
        List<TaskResponseDTO> tasks = taskService.getAllTasksForCurrentUser();
        return ResponseEntity.ok(
                ApiResponse.success("Tasks retrieved successfully", tasks)
        );
    }

    // -------------------------------------------------------
    // GET /api/tasks/{id} — Get task by ID
    // -------------------------------------------------------
    @GetMapping("/{id:\\d+}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> getTaskById(@PathVariable Long id) {
        log.info("Fetching task: {}", id);
        TaskResponseDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Task retrieved successfully", task)
        );
    }

    // -------------------------------------------------------
    // GET /api/tasks/status/{status} — Get tasks by status
    // -------------------------------------------------------
    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getTasksByStatus(
            @PathVariable TaskStatus status) {
        log.info("Fetching tasks with status: {}", status);
        List<TaskResponseDTO> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(
                ApiResponse.success("Tasks retrieved successfully", tasks)
        );
    }

    // -------------------------------------------------------
    // GET /api/tasks/overdue — Get overdue tasks
    // Must be declared BEFORE /{id} to avoid path ambiguity
    // -------------------------------------------------------
    @GetMapping("/overdue")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getOverdueTasks() {
        log.info("Fetching overdue tasks");
        List<TaskResponseDTO> tasks = taskService.getOverdueTasks();
        return ResponseEntity.ok(
                ApiResponse.success("Overdue tasks retrieved successfully", tasks)
        );
    }

    // -------------------------------------------------------
    // GET /api/tasks/overdue/count — Count overdue tasks
    // -------------------------------------------------------
    @GetMapping("/overdue/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> countOverdueTasks() {
        log.info("Counting overdue tasks");
        Long count = taskService.countOverdueTasks();
        return ResponseEntity.ok(
                ApiResponse.success("Overdue task count retrieved successfully", count)
        );
    }

    // -------------------------------------------------------
    // GET /api/tasks/due-soon?days=7 — Get tasks due soon
    // -------------------------------------------------------
    @GetMapping("/due-soon")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getTasksDueSoon(
            @RequestParam(defaultValue = "7") int days) {
        log.info("Fetching tasks due within {} days", days);
        List<TaskResponseDTO> tasks = taskService.getTasksDueSoon(days);
        return ResponseEntity.ok(
                ApiResponse.success("Tasks due soon retrieved successfully", tasks)
        );
    }

    // -------------------------------------------------------
    // PUT /api/tasks/{id} — Full update
    // -------------------------------------------------------
    @PutMapping("/{id:\\d+}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskUpdateDTO taskDTO) {
        log.info("Updating task: {}", id);
        TaskResponseDTO task = taskService.updateTask(id, taskDTO);
        return ResponseEntity.ok(
                ApiResponse.success("Task updated successfully", task)
        );
    }

    // -------------------------------------------------------
    // PATCH /api/tasks/{id}/status — Status-only update
    // -------------------------------------------------------
    @PatchMapping("/{id:\\d+}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status) {
        log.info("Updating task {} status to: {}", id, status);
        TaskResponseDTO task = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(
                ApiResponse.success("Task status updated successfully", task)
        );
    }

    // -------------------------------------------------------
    // DELETE /api/tasks/{id} — Delete task
    // -------------------------------------------------------
    @DeleteMapping("/{id:\\d+}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        log.info("Deleting task: {}", id);
        taskService.deleteTask(id);
        return ResponseEntity.ok(
                ApiResponse.success("Task deleted successfully")
        );
    }

    // -------------------------------------------------------
    // POST /api/tasks/filter — Filter with pagination
    // POST (not GET) because FilterDTO is sent as request body
    // -------------------------------------------------------
    @PostMapping("/filter")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<TaskResponseDTO>>> filterTasks(
            @RequestBody TaskFilterDTO filterDTO) {
        log.info("Filtering tasks with criteria: {}", filterDTO);
        Page<TaskResponseDTO> tasks = taskService.filterTasks(filterDTO);
        return ResponseEntity.ok(
                ApiResponse.success("Tasks filtered successfully", tasks)
        );
    }

    /**
     * Search tasks by keyword
     * GET /api/tasks/search?q=meeting
     */
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> searchTasks(
            @RequestParam String q) {

        log.info("Searching tasks with query: {}", q);

        TaskFilterDTO filterDTO = TaskFilterDTO.builder()
                .searchQuery(q)
                .page(0)
                .size(100)
                .build();

        Page<TaskResponseDTO> tasks = taskService.filterTasks(filterDTO);

        ApiResponse<List<TaskResponseDTO>> response = ApiResponse.success(
                "Tasks found: " + tasks.getTotalElements(),
                tasks.getContent()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get tasks by categories (comma-separated)
     * GET /api/tasks?category=1,2,3
     */
    @GetMapping(params = "category")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getTasksByCategories(
            @RequestParam String category) {

        log.info("Fetching tasks with categories: {}", category);

        Set<Long> categoryIds = Arrays.stream(category.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toSet());

        TaskFilterDTO filterDTO = TaskFilterDTO.builder()
                .categoryIds(categoryIds)
                .page(0)
                .size(100)
                .build();

        Page<TaskResponseDTO> tasks = taskService.filterTasks(filterDTO);

        ApiResponse<List<TaskResponseDTO>> response = ApiResponse.success(
                "Tasks retrieved successfully",
                tasks.getContent()
        );

        return ResponseEntity.ok(response);
    }

}