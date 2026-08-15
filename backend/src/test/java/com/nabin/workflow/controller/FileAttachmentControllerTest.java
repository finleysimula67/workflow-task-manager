package com.nabin.workflow.controller;

import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.exception.global.GlobalExceptionHandler;
import com.nabin.workflow.services.interfaces.FileAttachmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class FileAttachmentControllerTest {

    @Mock
    private FileAttachmentService fileAttachmentService;

    @InjectMocks
    private FileAttachmentController fileAttachmentController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(fileAttachmentController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("Legacy public /api/files/** endpoint should no longer exist")
    void serveFileEndpoint_ShouldNotExist() throws Exception {
        mockMvc.perform(get("/api/files/task-1/anything.png"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Authorized download should return the file")
    void downloadFile_ValidAttachment_ShouldReturn200() throws Exception {
        when(fileAttachmentService.downloadFile(1L)).thenReturn(new ByteArrayResource(new byte[]{1, 2, 3}));
        when(fileAttachmentService.getFileName(1L)).thenReturn("report.pdf");

        mockMvc.perform(get("/api/attachments/1/download"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"report.pdf\""));
    }

    @Test
    @DisplayName("Nonexistent or unauthorized attachment download should return 404")
    void downloadFile_NonexistentAttachment_ShouldReturn404() throws Exception {
        when(fileAttachmentService.downloadFile(99L))
                .thenThrow(new ResourceNotFoundException("Attachment", "id", 99L));

        mockMvc.perform(get("/api/attachments/99/download"))
                .andExpect(status().isNotFound());
    }
}
