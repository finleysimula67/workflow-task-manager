package com.nabin.workflow.dto.response;

import com.nabin.workflow.entities.TaskPriority;
import com.nabin.workflow.entities.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDTO {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private Boolean overdue;
    private Long userId;
    private String username;
    private long commentCount;


    // Multiple categories
    private Set<CategoryResponseDTO> categories;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    public Integer getDaysUntilDue() {
        if (dueDate == null) return null;
        return (int) java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), dueDate);
    }
    //Multiple files
    private List<FileAttachmentResponseDTO> attachments;

}