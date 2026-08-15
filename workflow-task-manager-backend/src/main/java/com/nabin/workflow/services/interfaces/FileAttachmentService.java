package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.response.FileAttachmentResponseDTO;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileAttachmentService {
    FileAttachmentResponseDTO uploadFile(Long taskId, MultipartFile file);
    List<FileAttachmentResponseDTO> getTaskAttachments(Long taskId);
    Resource downloadFile(Long attachmentId);
    void deleteAttachment(Long attachmentId);
    String getFileName(Long attachmentId);
}