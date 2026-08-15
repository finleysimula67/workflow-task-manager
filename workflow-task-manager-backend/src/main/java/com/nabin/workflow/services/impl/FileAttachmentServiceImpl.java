package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.response.FileAttachmentResponseDTO;
import com.nabin.workflow.entities.FileAttachment;
import com.nabin.workflow.entities.Task;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.FileStorageException;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.exception.UnauthorizedException;
import com.nabin.workflow.mapper.DTOMapper;
import com.nabin.workflow.repository.FileAttachmentRepository;
import com.nabin.workflow.repository.TaskRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.interfaces.FileAttachmentService;
import com.nabin.workflow.services.interfaces.FileStorageService;
import com.nabin.workflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileAttachmentServiceImpl implements FileAttachmentService {

    private final FileAttachmentRepository fileAttachmentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final DTOMapper dtoMapper;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_FILE_TYPES = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
            "application/zip"
    );

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public FileAttachmentResponseDTO uploadFile(Long taskId, MultipartFile file) {
        Long userId = SecurityUtil.getCurrentUserId();

        // Validate file
        validateFile(file);

        // Check task ownership
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Store file
        String filePath = fileStorageService.storeFile(file, taskId);

        // Create attachment record
        FileAttachment attachment = FileAttachment.builder()
                .fileName(filePath.substring(filePath.lastIndexOf('/') + 1))
                .originalFileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(filePath)
                .task(task)
                .uploadedBy(user)
                .build();

        FileAttachment saved = fileAttachmentRepository.save(attachment);

        log.info("✅ File uploaded - Task: {}, File: {}", taskId, file.getOriginalFilename());

        return dtoMapper.toFileAttachmentResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<FileAttachmentResponseDTO> getTaskAttachments(Long taskId) {
        Long userId = SecurityUtil.getCurrentUserId();

        // Verify task ownership
        taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        List<FileAttachment> attachments = fileAttachmentRepository.findByTaskId(taskId);

        return attachments.stream()
                .map(dtoMapper::toFileAttachmentResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public Resource downloadFile(Long attachmentId) {
        Long userId = SecurityUtil.getCurrentUserId();

        FileAttachment attachment = fileAttachmentRepository.findByIdAndTaskUserId(attachmentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));

        log.info("✅ Downloading file: {}", attachment.getOriginalFileName());

        return fileStorageService.loadFileAsResource(attachment.getFilePath());
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void deleteAttachment(Long attachmentId) {
        Long userId = SecurityUtil.getCurrentUserId();

        FileAttachment attachment = fileAttachmentRepository.findByIdAndTaskUserId(attachmentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));

        // Delete physical file
        fileStorageService.deleteFile(attachment.getFilePath());

        // Delete database record
        fileAttachmentRepository.delete(attachment);

        log.info("✅ Attachment deleted: {}", attachment.getOriginalFileName());
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public String getFileName(Long attachmentId) {
        Long userId = SecurityUtil.getCurrentUserId();

        FileAttachment attachment = fileAttachmentRepository.findByIdAndTaskUserId(attachmentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));

        return attachment.getOriginalFileName();
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileStorageException("Cannot upload empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("File size exceeds maximum limit of 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_FILE_TYPES.contains(contentType)) {
            throw new FileStorageException("File type not allowed: " + contentType);
        }
    }
}