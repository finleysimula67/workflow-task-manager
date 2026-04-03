package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.request.TaskRequestDTO;
import com.nabin.workflow.dto.request.TaskFilterDTO;
import com.nabin.workflow.dto.request.TaskUpdateDTO;
import com.nabin.workflow.dto.response.TaskResponseDTO;
import com.nabin.workflow.dto.response.TaskStatsDTO;
import com.nabin.workflow.entities.*;
import com.nabin.workflow.exception.InvalidBusinessRuleException;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.mapper.DTOMapper;
import com.nabin.workflow.repository.CategoryRepository;
import com.nabin.workflow.repository.TaskRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.interfaces.TaskService;
import com.nabin.workflow.specification.TaskSpecification;
import com.nabin.workflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final DTOMapper dtoMapper;

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public TaskResponseDTO createTask(TaskRequestDTO taskDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (taskDTO.getDueDate() != null && taskDTO.getDueDate().isBefore(LocalDate.now())) {
            throw new InvalidBusinessRuleException("Due date must be in the present or future");
        }

        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .status(taskDTO.getStatus() != null ? taskDTO.getStatus() : TaskStatus.TODO)
                .priority(taskDTO.getPriority() != null ? taskDTO.getPriority() : TaskPriority.MEDIUM)
                .dueDate(taskDTO.getDueDate())
                .user(user)
                .build();

        // Handle multiple categories
        if (taskDTO.getCategoryIds() != null && !taskDTO.getCategoryIds().isEmpty()) {
            Set<Category> categories = categoryRepository.findByIdInAndUserId(taskDTO.getCategoryIds(), userId);

            if (categories.size() != taskDTO.getCategoryIds().size()) {
                throw new ResourceNotFoundException("One or more categories not found");
            }

            task.setCategories(categories);
        }

        Task savedTask = taskRepository.save(task);
        log.info("✅ Task created - ID: {}, Title: {}, Categories: {}",
                savedTask.getId(), savedTask.getTitle(), savedTask.getCategories().size());

        return dtoMapper.toTaskResponseDTO(savedTask);
    }
    // =========================================================
    // READ
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public TaskResponseDTO getTaskById(Long taskId) {
        Long userId = SecurityUtil.getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        return dtoMapper.toTaskResponseDTO(task);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<TaskResponseDTO> getAllTasksForCurrentUser() {
        Long userId = SecurityUtil.getCurrentUserId();
        return taskRepository.findByUserId(userId).stream()
                .map(dtoMapper::toTaskResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<TaskResponseDTO> getTasksByStatus(TaskStatus status) {
        Long userId = SecurityUtil.getCurrentUserId();
        return taskRepository.findByUserIdAndStatus(userId, status).stream()
                .map(dtoMapper::toTaskResponseDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public TaskResponseDTO updateTask(Long taskId, TaskUpdateDTO taskDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        if (taskDTO.getTitle() != null) {
            task.setTitle(taskDTO.getTitle());
        }

        if (taskDTO.getDescription() != null) {
            task.setDescription(taskDTO.getDescription());
        }

        if (taskDTO.getPriority() != null) {
            task.setPriority(taskDTO.getPriority());
        }

        if (taskDTO.getDueDate() != null) {
            if (taskDTO.getDueDate().isBefore(LocalDate.now())) {
                throw new InvalidBusinessRuleException("Due date must be in the present or future");
            }
            task.setDueDate(taskDTO.getDueDate());
        }

        if (taskDTO.getStatus() != null && taskDTO.getStatus() != task.getStatus()) {
            updateTaskStatusInternal(task, taskDTO.getStatus());
        }

        // Update categories
        if (taskDTO.getCategoryIds() != null) {
            task.clearCategories();

            if (!taskDTO.getCategoryIds().isEmpty()) {
                Set<Category> categories = categoryRepository.findByIdInAndUserId(taskDTO.getCategoryIds(), userId);

                if (categories.size() != taskDTO.getCategoryIds().size()) {
                    throw new ResourceNotFoundException("One or more categories not found");
                }

                categories.forEach(task::addCategory);
            }
        }

        Task updatedTask = taskRepository.save(task);
        log.info("✅ Task updated - ID: {}", taskId);

        return dtoMapper.toTaskResponseDTO(updatedTask);
    }

    @Override
    @PreAuthorize("isAuthenticated()")
    public TaskResponseDTO updateTaskStatus(Long taskId, TaskStatus newStatus) {
        Long userId = SecurityUtil.getCurrentUserId();

        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        updateTaskStatusInternal(task, newStatus);

        Task updatedTask = taskRepository.save(task);
        log.info("Task status updated: {} → {} by user: {}", taskId, newStatus, userId);
        return dtoMapper.toTaskResponseDTO(updatedTask);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    @PreAuthorize("isAuthenticated()")
    public void deleteTask(Long taskId) {
        Long userId = SecurityUtil.getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        taskRepository.delete(task);
        log.info("Task deleted: {} by user: {}", taskId, userId);
    }

    // =========================================================
    // FILTERING & ADVANCED QUERIES
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public Page<TaskResponseDTO> filterTasks(TaskFilterDTO filterDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        Specification<Task> spec = Specification.where(TaskSpecification.hasUserId(userId));

        if (filterDTO.getStatus() != null) {
            spec = spec.and(TaskSpecification.hasStatus(filterDTO.getStatus()));
        }

        if (filterDTO.getPriority() != null) {
            spec = spec.and(TaskSpecification.hasPriority(filterDTO.getPriority()));
        }

        // Filter by multiple categories
        if (filterDTO.getCategoryIds() != null && !filterDTO.getCategoryIds().isEmpty()) {
            spec = spec.and(TaskSpecification.hasCategoryIds(filterDTO.getCategoryIds()));
        }

        if (filterDTO.getOverdue() != null && filterDTO.getOverdue()) {
            spec = spec.and(TaskSpecification.isOverdue());
        }

        if (filterDTO.getDueDateFrom() != null) {
            spec = spec.and(TaskSpecification.dueDateAfter(filterDTO.getDueDateFrom()));
        }

        if (filterDTO.getDueDateTo() != null) {
            spec = spec.and(TaskSpecification.dueDateBefore(filterDTO.getDueDateTo()));
        }

        // Search in title and description
        if (filterDTO.getSearchQuery() != null && !filterDTO.getSearchQuery().isBlank()) {
            spec = spec.and(TaskSpecification.searchByTitleOrDescription(filterDTO.getSearchQuery()));
        }

        Sort sort = Sort.by(
                filterDTO.getSortDirection().equalsIgnoreCase("ASC")
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC,
                filterDTO.getSortBy()
        );

        Pageable pageable = PageRequest.of(
                filterDTO.getPage(),
                filterDTO.getSize(),
                sort
        );

        Page<Task> tasks = taskRepository.findAll(spec, pageable);

        return tasks.map(dtoMapper::toTaskResponseDTO);
    }
    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<TaskResponseDTO> getOverdueTasks() {
        Long userId = SecurityUtil.getCurrentUserId();
        return taskRepository.findAll(
                Specification.where(TaskSpecification.hasUserId(userId))
                        .and(TaskSpecification.isOverdue())
        ).stream().map(dtoMapper::toTaskResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<TaskResponseDTO> getTasksDueSoon(int days) {
        Long userId = SecurityUtil.getCurrentUserId();
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);

        return taskRepository.findAll(
                Specification.where(TaskSpecification.hasUserId(userId))
                        .and(TaskSpecification.dueDateBetween(today, futureDate))
                        .and(TaskSpecification.statusNotIn(TaskStatus.COMPLETED, TaskStatus.ARCHIVED))
        ).stream().map(dtoMapper::toTaskResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public Long countOverdueTasks() {
        Long userId = SecurityUtil.getCurrentUserId();
        return taskRepository.count(
                Specification.where(TaskSpecification.hasUserId(userId))
                        .and(TaskSpecification.isOverdue())
        );
    }

    // =========================================================
    // PRIVATE HELPERS
    // =========================================================

    /**
     **
      * Validates status transitions and updates completedAt timestamp automatically.
     */
    private void updateTaskStatusInternal(Task task, TaskStatus newStatus) {
        if (!task.canTransitionTo(newStatus)) {
            throw new InvalidBusinessRuleException(
                    "Invalid status transition: cannot move from " + task.getStatus() + " to " + newStatus +
                            ". Valid transitions: " + java.util.Arrays.toString(task.getStatus().getValidTransitions())
            );
        }

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(newStatus);

        if (newStatus == TaskStatus.COMPLETED && oldStatus != TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
        } else if (newStatus != TaskStatus.COMPLETED) {
            task.setCompletedAt(null);
        }
    }

    /**
     */
    private void validateDueDateForCreate(LocalDate dueDate) {
        if (dueDate == null) return;

        if (dueDate.isBefore(LocalDate.now())) {
            throw new InvalidBusinessRuleException("Due date cannot be in the past");
        }
        if (dueDate.isAfter(LocalDate.now().plusYears(5))) {
            throw new InvalidBusinessRuleException("Due date cannot be more than 5 years in the future");
        }
    }

    /**
     * HIGH/URGENT priority requires a due date.
     * During updates, resolvedDueDate is the task's effective due date (existing or newly set).
     */
    private void validatePriorityRequiresDueDate(TaskPriority priority, LocalDate resolvedDueDate) {
        if ((priority == TaskPriority.HIGH || priority == TaskPriority.URGENT)
                && resolvedDueDate == null) {
            throw new InvalidBusinessRuleException(
                    priority.getDisplayName() + " priority tasks must have a due date"
            );
        }
    }

    /**
     * Get comprehensive task statistics
     */
    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public TaskStatsDTO getTaskStats() {
        Long userId = SecurityUtil.getCurrentUserId();
        LocalDate today = LocalDate.now();
        LocalDate weekFromNow = today.plusDays(7);

        // Get all counts
        Long totalTasks = taskRepository.countByUserId(userId);
        Long activeTasks = taskRepository.countActiveTasksByUserId(userId);

        // Counts by status
        Long todoTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.TODO);
        Long inProgressTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);
        Long completedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
        Long archivedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.ARCHIVED);

        // Counts by priority
        Long lowPriorityTasks = taskRepository.countByUserIdAndPriority(userId, TaskPriority.LOW);
        Long mediumPriorityTasks = taskRepository.countByUserIdAndPriority(userId, TaskPriority.MEDIUM);
        Long highPriorityTasks = taskRepository.countByUserIdAndPriority(userId, TaskPriority.HIGH);
        Long urgentPriorityTasks = taskRepository.countByUserIdAndPriority(userId, TaskPriority.URGENT);

        // Special counts
        Long overdueTasks = taskRepository.countOverdueTasksByUserId(userId, today);
        Long dueSoonTasks = taskRepository.countTasksDueSoon(userId, today, weekFromNow);

        // Build stats DTO
        TaskStatsDTO stats = TaskStatsDTO.builder()
                .totalTasks(totalTasks)
                .activeTasks(activeTasks)
                .todoTasks(todoTasks)
                .inProgressTasks(inProgressTasks)
                .completedTasks(completedTasks)
                .archivedTasks(archivedTasks)
                .lowPriorityTasks(lowPriorityTasks)
                .mediumPriorityTasks(mediumPriorityTasks)
                .highPriorityTasks(highPriorityTasks)
                .urgentPriorityTasks(urgentPriorityTasks)
                .overdueTasks(overdueTasks)
                .dueSoonTasks(dueSoonTasks)
                .build();

        // Calculate completion rate
        stats.calculateCompletionRate();

        // Calculate priority distribution
        if (totalTasks > 0) {
            Map<String, Double> priorityDistribution = new HashMap<>();
            priorityDistribution.put("LOW", (lowPriorityTasks * 100.0) / totalTasks);
            priorityDistribution.put("MEDIUM", (mediumPriorityTasks * 100.0) / totalTasks);
            priorityDistribution.put("HIGH", (highPriorityTasks * 100.0) / totalTasks);
            priorityDistribution.put("URGENT", (urgentPriorityTasks * 100.0) / totalTasks);
            stats.setPriorityDistribution(priorityDistribution);

            // Calculate status distribution
            Map<String, Double> statusDistribution = new HashMap<>();
            statusDistribution.put("TODO", (todoTasks * 100.0) / totalTasks);
            statusDistribution.put("IN_PROGRESS", (inProgressTasks * 100.0) / totalTasks);
            statusDistribution.put("COMPLETED", (completedTasks * 100.0) / totalTasks);
            statusDistribution.put("ARCHIVED", (archivedTasks * 100.0) / totalTasks);
            stats.setStatusDistribution(statusDistribution);
        }

        log.info("Task stats retrieved for user: {}", userId);
        return stats;
    }
}