package com.nabin.workflow.dto.request;

import com.nabin.workflow.entities.TaskPriority;
import com.nabin.workflow.entities.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskFilterDTO {
    private TaskStatus status;
    private TaskPriority priority;

    // Multiple category IDs (filter by ANY of these)
    private Set<Long> categoryIds;

    private Boolean overdue;
    private LocalDate dueDateFrom;
    private LocalDate dueDateTo;

    // Search query (searches in title AND description)
    private String searchQuery;

    // Pagination
    @Builder.Default
    private Integer page = 0;

    @Builder.Default
    private Integer size = 10;

    // Sorting
    @Builder.Default
    private String sortBy = "createdAt";

    @Builder.Default
    private String sortDirection = "DESC";
}