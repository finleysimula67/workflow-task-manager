package com.nabin.workflow.services;

import com.nabin.workflow.dto.request.TaskRequestDTO;
import com.nabin.workflow.dto.response.TaskResponseDTO;
import com.nabin.workflow.entities.*;
import com.nabin.workflow.exception.InvalidBusinessRuleException;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.mapper.DTOMapper;
import com.nabin.workflow.repository.CategoryRepository;
import com.nabin.workflow.repository.TaskRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.impl.TaskServiceImpl;
import com.nabin.workflow.util.SecurityUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import com.nabin.workflow.security.user.UserPrincipal;
import java.util.Collections;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private DTOMapper dtoMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    private User testUser;
    private Task testTask;
    private TaskRequestDTO validTaskRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        testTask = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .dueDate(LocalDate.now().plusDays(7))
                .user(testUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .categories(new HashSet<>())
                .build();

        validTaskRequest = TaskRequestDTO.builder()
                .title("New Task")
                .description("New Description")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .dueDate(LocalDate.now().plusDays(7))
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void mockSecurityContext(Long userId) {
        UserPrincipal principal = new UserPrincipal(userId, "testuser", "test@example.com", "password", true, Collections.emptyList());
        Authentication auth = mock(Authentication.class);
        lenient().when(auth.isAuthenticated()).thenReturn(true);
        lenient().when(auth.getPrincipal()).thenReturn(principal);
        SecurityContext ctx = mock(SecurityContext.class);
        lenient().when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    @Nested
    @DisplayName("Task Creation Tests")
    class TaskCreationTests {

        @Test
        @DisplayName("Should create task successfully with valid data")
        void createTask_WithValidData_ShouldSucceed() {
            mockSecurityContext(1L);
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(taskRepository.save(any(Task.class))).thenReturn(testTask);
            when(dtoMapper.toTaskResponseDTO(any(Task.class))).thenReturn(
                TaskResponseDTO.builder().id(1L).title("Test Task").build());

            TaskResponseDTO result = taskService.createTask(validTaskRequest);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            verify(taskRepository).save(any(Task.class));
        }

        @Test
        @DisplayName("Should throw exception when due date is in the past")
        void createTask_WithPastDueDate_ShouldThrowException() {
            TaskRequestDTO invalidRequest = TaskRequestDTO.builder()
                    .title("Task")
                    .dueDate(LocalDate.now().minusDays(1))
                    .build();

            mockSecurityContext(1L);
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

            assertThatThrownBy(() -> taskService.createTask(invalidRequest))
                    .isInstanceOf(InvalidBusinessRuleException.class)
                    .hasMessageContaining("Due date must be in the present or future");
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void createTask_WithNonExistentUser_ShouldThrowException() {
            mockSecurityContext(999L);
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.createTask(validTaskRequest))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User");
        }
    }

    @Nested
    @DisplayName("Task Retrieval Tests")
    class TaskRetrievalTests {

        @Test
        @DisplayName("Should get task by ID successfully")
        void getTaskById_WithValidId_ShouldReturnTask() {
            mockSecurityContext(1L);
            when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));
            when(dtoMapper.toTaskResponseDTO(testTask)).thenReturn(
                TaskResponseDTO.builder().id(1L).title("Test Task").build());

            TaskResponseDTO result = taskService.getTaskById(1L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should throw exception when task not found")
        void getTaskById_WithNonExistentId_ShouldThrowException() {
            mockSecurityContext(1L);
            when(taskRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.getTaskById(999L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Task Status Transition Tests")
    class TaskStatusTransitionTests {

        @Test
        @DisplayName("Should transition from TODO to IN_PROGRESS")
        void updateTaskStatus_TodoToInProgress_ShouldSucceed() {
            mockSecurityContext(1L);
            when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));
            when(taskRepository.save(any(Task.class))).thenReturn(testTask);
            when(dtoMapper.toTaskResponseDTO(any(Task.class))).thenReturn(
                TaskResponseDTO.builder().id(1L).status(TaskStatus.IN_PROGRESS).build());

            TaskResponseDTO result = taskService.updateTaskStatus(1L, TaskStatus.IN_PROGRESS);

            assertThat(result.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        }
    }

    @Nested
    @DisplayName("Task Deletion Tests")
    class TaskDeletionTests {

        @Test
        @DisplayName("Should delete task successfully")
        void deleteTask_WithValidId_ShouldSucceed() {
            mockSecurityContext(1L);
            when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));
            doNothing().when(taskRepository).delete(testTask);

            taskService.deleteTask(1L);

            verify(taskRepository).delete(testTask);
        }
    }
}
