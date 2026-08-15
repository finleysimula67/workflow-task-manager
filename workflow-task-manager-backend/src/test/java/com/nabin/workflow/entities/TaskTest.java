package com.nabin.workflow.entities;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class TaskTest {

    @ParameterizedTest
    @DisplayName("Should validate status transitions correctly")
    @CsvSource({
        "TODO, IN_PROGRESS, true",
        "TODO, ARCHIVED, true",
        "TODO, COMPLETED, false",
        "IN_PROGRESS, COMPLETED, true",
        "IN_PROGRESS, ARCHIVED, true",
        "IN_PROGRESS, TODO, true",
        "COMPLETED, ARCHIVED, true",
        "COMPLETED, TODO, true",
        "COMPLETED, IN_PROGRESS, false",
        "ARCHIVED, TODO, false",
        "ARCHIVED, IN_PROGRESS, false"
    })
    void canTransitionTo_ShouldValidateTransitions(TaskStatus from, TaskStatus to, boolean expected) {
        Task task = Task.builder()
                .status(from)
                .build();

        assertThat(task.canTransitionTo(to)).isEqualTo(expected);
    }

    @Test
    @DisplayName("Same status transition should always be allowed")
    void canTransitionTo_SameStatus_ShouldAlwaysReturnTrue() {
        Task task = Task.builder()
                .status(TaskStatus.TODO)
                .build();

        assertThat(task.canTransitionTo(TaskStatus.TODO)).isTrue();
    }

    @Test
    @DisplayName("Task should build with all fields")
    void builder_ShouldCreateTaskWithAllFields() {
        Task task = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Description")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .build();

        assertThat(task.getTitle()).isEqualTo("Test Task");
        assertThat(task.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        assertThat(task.getPriority()).isEqualTo(TaskPriority.HIGH);
    }
}
