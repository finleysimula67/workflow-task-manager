package com.nabin.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductivityDTO {
    private int currentStreak;
    private int longestStreak;
    private long tasksCompletedToday;
    private int weeklyGoal;
    private int weeklyProgress;
    private List<ChartDataPoint> weeklyChart;
    private List<ChartDataPoint> monthlyChart;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartDataPoint {
        private String label;
        private long value;
    }
}
