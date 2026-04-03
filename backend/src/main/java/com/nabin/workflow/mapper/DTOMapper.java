package com.nabin.workflow.mapper;

import com.nabin.workflow.dto.response.*;
import com.nabin.workflow.entities.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DTOMapper {

    /**
     * Convert Task entity to TaskResponseDTO
     */
    public TaskResponseDTO toTaskResponseDTO(Task task) {
        if (task == null) {
            return null;
        }

        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .overdue(task.isOverdue())
                .userId(task.getUser().getId())
                .username(task.getUser().getUsername())
                .categories(task.getCategories().stream()
                        .map(this::toCategoryResponseDTO)
                        .collect(Collectors.toSet()))
                .attachments(task.getAttachments().stream()
                        .map(this::toFileAttachmentResponseDTO)
                        .collect(Collectors.toList()))
                .commentCount(task.getComments() != null ? task.getComments().size() : 0)  // ADD THIS LINE
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .completedAt(task.getCompletedAt())
                .build();
    }
    /**
     * Convert User entity to UserResponseDTO
     */
    public UserResponseDTO toUserResponseDTO(User user) {
        if (user == null) {
            return null;
        }

        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .profileImage(user.getProfileImage())
                .roles(user.getRoles().stream()
                        .map(role -> RoleResponseDTO.builder()
                                .id(role.getId())
                                .name(role.getName())
                                .build())
                        .collect(Collectors.toSet()))
                .build();
    }

    /**
     * Convert Category entity to CategoryResponseDTO
     */
    public CategoryResponseDTO toCategoryResponseDTO(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .color(category.getColor())
                .userId(category.getUser().getId())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    /**
     * Convert FileAttachment entity to FileAttachmentResponseDTO
     */
    public FileAttachmentResponseDTO toFileAttachmentResponseDTO(FileAttachment attachment) {
        if (attachment == null) {
            return null;
        }

        return FileAttachmentResponseDTO.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .originalFileName(attachment.getOriginalFileName())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .formattedFileSize(attachment.getFormattedFileSize())
                .fileExtension(attachment.getFileExtension())
                .taskId(attachment.getTask().getId())
                .uploadedByUsername(attachment.getUploadedBy().getUsername())
                .uploadedAt(attachment.getUploadedAt())
                .downloadUrl("/api/attachments/" + attachment.getId() + "/download")
                .build();
    }

     /** For Comment Responses */
    public static CommentResponseDTO toCommentResponseDTO(Comment comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setTaskId(comment.getTask().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setUserEmail(comment.getUser().getEmail());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setEdited(comment.isEdited());
        return dto;
    }
}
