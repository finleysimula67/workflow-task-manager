package com.nabin.workflow.services;

import com.nabin.workflow.exception.FileStorageException;
import com.nabin.workflow.services.impl.FileStorageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceImplTest {

    @TempDir
    Path tempDir;

    private FileStorageServiceImpl fileStorageService;

    @BeforeEach
    void setUp() throws IOException {
        fileStorageService = new FileStorageServiceImpl(tempDir.toString());

        Path taskDir = tempDir.resolve("task-1");
        Files.createDirectories(taskDir);
        Files.writeString(taskDir.resolve("notes.txt"), "hello world");

        Path outsideFile = tempDir.getParent().resolve("outside.txt");
        if (Files.notExists(outsideFile)) {
            Files.writeString(outsideFile, "secret outside uploads");
        }
    }

    @Test
    @DisplayName("Valid file inside upload directory should be served")
    void loadFileAsResource_ValidPath_ShouldReturnFile() throws IOException {
        Resource resource = fileStorageService.loadFileAsResource("task-1/notes.txt");

        assertThat(resource.exists()).isTrue();
        assertThat(resource.getContentAsString(StandardCharsets.UTF_8)).isEqualTo("hello world");
    }

    @Test
    @DisplayName("Nonexistent file inside upload directory should throw FileStorageException")
    void loadFileAsResource_NonexistentFile_ShouldThrow() {
        assertThatThrownBy(() -> fileStorageService.loadFileAsResource("task-1/missing.txt"))
                .isInstanceOf(FileStorageException.class)
                .hasMessageContaining("File not found");
    }

    @Test
    @DisplayName("../ traversal should be rejected")
    void loadFileAsResource_DotDotTraversal_ShouldBeRejected() {
        assertThatThrownBy(() -> fileStorageService.loadFileAsResource("../outside.txt"))
                .isInstanceOf(FileStorageException.class);
    }

    @Test
    @DisplayName("Nested ../ traversal should be rejected")
    void loadFileAsResource_NestedTraversal_ShouldBeRejected() {
        assertThatThrownBy(() -> fileStorageService.loadFileAsResource("task-1/../../outside.txt"))
                .isInstanceOf(FileStorageException.class);
    }

    @Test
    @DisplayName("Backslash ../ traversal should be rejected")
    void loadFileAsResource_BackslashTraversal_ShouldBeRejected() {
        assertThatThrownBy(() -> fileStorageService.loadFileAsResource("..\\..\\outside.txt"))
                .isInstanceOf(FileStorageException.class);
    }

    @Test
    @DisplayName("Absolute path escaping the upload directory should be rejected")
    void loadFileAsResource_AbsolutePathOutsideRoot_ShouldBeRejected() {
        Path outsideRoot = tempDir.getParent().resolve("outside.txt");
        assertThatThrownBy(() -> fileStorageService.loadFileAsResource(outsideRoot.toString()))
                .isInstanceOf(FileStorageException.class);
    }

    @Test
    @DisplayName("Empty and null paths should be rejected")
    void loadFileAsResource_EmptyOrNullPath_ShouldThrow() {
        assertThatThrownBy(() -> fileStorageService.loadFileAsResource(""))
                .isInstanceOf(FileStorageException.class);
        assertThatThrownBy(() -> fileStorageService.loadFileAsResource(null))
                .isInstanceOf(FileStorageException.class);
    }

    @Test
    @DisplayName("deleteFile should refuse to delete outside the upload directory")
    void deleteFile_Traversal_ShouldBeRejectedAndNotDelete() throws IOException {
        Path outsideFile = tempDir.getParent().resolve("outside.txt");
        assertThat(outsideFile).exists();

        assertThatThrownBy(() -> fileStorageService.deleteFile("../../outside.txt"))
                .isInstanceOf(FileStorageException.class);

        assertThat(outsideFile).exists();
    }
}
