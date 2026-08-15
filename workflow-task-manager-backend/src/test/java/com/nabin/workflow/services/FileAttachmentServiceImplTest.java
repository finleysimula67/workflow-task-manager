package com.nabin.workflow.services;

import com.nabin.workflow.entities.FileAttachment;
import com.nabin.workflow.entities.Task;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.FileStorageException;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.mapper.DTOMapper;
import com.nabin.workflow.repository.FileAttachmentRepository;
import com.nabin.workflow.repository.TaskRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.security.user.UserPrincipal;
import com.nabin.workflow.services.impl.FileAttachmentServiceImpl;
import com.nabin.workflow.services.interfaces.FileStorageService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FileAttachmentServiceImplTest {

    @Mock
    private FileAttachmentRepository fileAttachmentRepository;
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private FileStorageService fileStorageService;
    @Mock
    private DTOMapper dtoMapper;

    @InjectMocks
    private FileAttachmentServiceImpl fileAttachmentService;

    private User testUser;
    private Task testTask;
    private FileAttachment testAttachment;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        testTask = Task.builder()
                .id(1L)
                .user(testUser)
                .build();

        testAttachment = FileAttachment.builder()
                .id(1L)
                .fileName("uuid.pdf")
                .originalFileName("report.pdf")
                .fileType("application/pdf")
                .fileSize(1024L)
                .filePath("task-1/uuid.pdf")
                .task(testTask)
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
    @DisplayName("File Download Tests")
    class FileDownloadTests {

        @Test
        @DisplayName("Owner of the task should be able to download the file")
        void downloadFile_AuthorizedUser_ShouldReturnResource() {
            mockSecurityContext(1L);
            when(fileAttachmentRepository.findByIdAndTaskUserId(1L, 1L))
                    .thenReturn(Optional.of(testAttachment));
            Resource resource = mock(Resource.class);
            when(fileStorageService.loadFileAsResource("task-1/uuid.pdf")).thenReturn(resource);

            Resource result = fileAttachmentService.downloadFile(1L);

            assertThat(result).isNotNull();
        }

        @Test
        @DisplayName("User who does not own the task should get ResourceNotFoundException")
        void downloadFile_UnauthorizedUser_ShouldThrow() {
            mockSecurityContext(2L);
            when(fileAttachmentRepository.findByIdAndTaskUserId(1L, 2L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> fileAttachmentService.downloadFile(1L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("Nonexistent attachment should get ResourceNotFoundException")
        void downloadFile_NonexistentAttachment_ShouldThrow() {
            mockSecurityContext(1L);
            when(fileAttachmentRepository.findByIdAndTaskUserId(999L, 1L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> fileAttachmentService.downloadFile(999L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("Nonexistent task should get ResourceNotFoundException when listing attachments")
        void getTaskAttachments_NonexistentOrForeignTask_ShouldThrow() {
            mockSecurityContext(1L);
            when(taskRepository.findByIdAndUserId(99L, 1L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> fileAttachmentService.getTaskAttachments(99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("User who does not own the attachment should not be able to delete it")
        void deleteAttachment_UnauthorizedUser_ShouldThrow() {
            mockSecurityContext(2L);
            when(fileAttachmentRepository.findByIdAndTaskUserId(1L, 2L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> fileAttachmentService.deleteAttachment(1L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("File Upload Validation Tests")
    class FileUploadValidationTests {

        @Test
        @DisplayName("File larger than 10MB should be rejected")
        void uploadFile_OversizedFile_ShouldThrow() {
            mockSecurityContext(1L);
            MockMultipartFile file = new MockMultipartFile(
                    "file", "big.pdf", "application/pdf", new byte[10 * 1024 * 1024 + 1]);

            assertThatThrownBy(() -> fileAttachmentService.uploadFile(1L, file))
                    .isInstanceOf(FileStorageException.class)
                    .hasMessageContaining("10MB");
        }
    }
}
