package com.nabin.workflow.dto.request;

import com.nabin.workflow.entities.TaskPriority;
import com.nabin.workflow.entities.TaskStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateDTO {

    @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
    private String title;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private LocalDate dueDate;
    
    private Set<Long> categoryIds;
}