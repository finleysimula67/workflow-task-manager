package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.request.TaskRequestDTO;
import com.nabin.workflow.dto.request.TaskFilterDTO;
import com.nabin.workflow.dto.request.TaskUpdateDTO;
import com.nabin.workflow.dto.response.TaskResponseDTO;
import com.nabin.workflow.dto.response.TaskStatsDTO;
import com.nabin.workflow.entities.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskService {

    TaskResponseDTO createTask(TaskRequestDTO taskDTO);      // ← was TaskRequestDTO

    TaskResponseDTO getTaskById(Long taskId);

    List<TaskResponseDTO> getAllTasksForCurrentUser();

    List<TaskResponseDTO> getTasksByStatus(TaskStatus status);

    TaskResponseDTO updateTask(Long taskId, TaskUpdateDTO taskDTO);

    TaskResponseDTO updateTaskStatus(Long taskId, TaskStatus newStatus);

    void deleteTask(Long taskId);

    Page<TaskResponseDTO> filterTasks(TaskFilterDTO filterDTO);

    List<TaskResponseDTO> getOverdueTasks();

    List<TaskResponseDTO> getTasksDueSoon(int days);

    Long countOverdueTasks();

    TaskStatsDTO getTaskStats();

    com.nabin.workflow.dto.response.    ProductivityDTO getProductivity();

    void reorderTasks(java.util.List<com.nabin.workflow.dto.request.ReorderDTO.OrderEntry> order);

    List<TaskResponseDTO> searchTasksFullText(String query);

    Page<TaskResponseDTO> searchTasksFullTextPaged(String query, org.springframework.data.domain.Pageable pageable);

}