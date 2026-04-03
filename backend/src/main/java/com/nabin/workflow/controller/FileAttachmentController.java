package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.response.FileAttachmentResponseDTO;
import com.nabin.workflow.services.interfaces.FileAttachmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class FileAttachmentController {

    private final FileAttachmentService fileAttachmentService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/attachments/task/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FileAttachmentResponseDTO>> uploadFile(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file) {
        log.info("Uploading file to task: {}", taskId);
        FileAttachmentResponseDTO attachment = fileAttachmentService.uploadFile(taskId, file);
        ApiResponse<FileAttachmentResponseDTO> response = ApiResponse.success("File uploaded successfully", attachment);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/attachments/task/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<FileAttachmentResponseDTO>>> getTaskAttachments(@PathVariable Long taskId) {
        log.info("Getting attachments for task: {}", taskId);
        List<FileAttachmentResponseDTO> attachments = fileAttachmentService.getTaskAttachments(taskId);
        ApiResponse<List<FileAttachmentResponseDTO>> response = ApiResponse.success("Attachments retrieved successfully", attachments);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/attachments/{id}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        log.info("Downloading attachment: {}", id);
        Resource resource = fileAttachmentService.downloadFile(id);
        String fileName = fileAttachmentService.getFileName(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/attachments/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(@PathVariable Long id) {
        log.info("Deleting attachment: {}", id);
        fileAttachmentService.deleteAttachment(id);
        ApiResponse<Void> response = ApiResponse.success("Attachment deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/files/{type}/{filename}")
    public ResponseEntity<Resource> serveFile(@PathVariable String type, @PathVariable String filename) {
        try {
            String uploadPath = System.getProperty("user.dir") + "/" + uploadDir + "/" + type;
            Path filePath = Paths.get(uploadPath).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = "application/octet-stream";
                String lowerFilename = filename.toLowerCase();
                if (lowerFilename.endsWith(".png")) contentType = "image/png";
                else if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) contentType = "image/jpeg";
                else if (lowerFilename.endsWith(".gif")) contentType = "image/gif";
                else if (lowerFilename.endsWith(".webp")) contentType = "image/webp";
                else if (lowerFilename.endsWith(".pdf")) contentType = "application/pdf";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                log.warn("File not found: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            log.error("Error serving file: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
