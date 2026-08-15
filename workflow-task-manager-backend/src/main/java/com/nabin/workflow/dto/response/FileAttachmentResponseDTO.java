package com.nabin.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileAttachmentResponseDTO {
    private Long id;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private String formattedFileSize;
    private String fileExtension;
    private Long taskId;
    private String uploadedByUsername;
    private LocalDateTime uploadedAt;
    private String downloadUrl;
}