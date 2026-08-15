package com.nabin.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatsDTO {

    // Total counts
    private Long totalTasks;
    private Long activeTasks;
    // Not completed or archived

    // Counts by status
    private Long todoTasks;
    private Long inProgressTasks;
    private Long completedTasks;
    private Long archivedTasks;

    // Counts by priority
    private Long lowPriorityTasks;
    private Long mediumPriorityTasks;
    private Long highPriorityTasks;
    private Long urgentPriorityTasks;

    // Special counts
    private Long overdueTasks;
    private Long dueSoonTasks;  // Due_within 7 days

    // Completion rate (percentage)
    private Double completionRate;

    // Priority distribution (percentage)
    private Map<String, Double> priorityDistribution;

    // Status distribution (percentage)
    private Map<String, Double> statusDistribution;

    // Helper method to calculate completion rate
    public void calculateCompletionRate() {
        if (totalTasks > 0) {
            this.completionRate = (completedTasks * 100.0) / totalTasks;
        } else {
            this.completionRate = 0.0;
        }
    }
}