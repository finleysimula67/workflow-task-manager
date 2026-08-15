package com.nabin.workflow.specification;

import com.nabin.workflow.entities.Category;
import com.nabin.workflow.entities.Task;
import com.nabin.workflow.entities.TaskPriority;
import com.nabin.workflow.entities.TaskStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.Set;

public class TaskSpecification {

    public static Specification<Task> hasUserId(Long userId) {
        return (root, query, cb) ->
                cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Task> hasStatus(TaskStatus status) {
        return (root, query, cb) ->
                cb.equal(root.get("status"), status);
    }

    public static Specification<Task> hasPriority(TaskPriority priority) {
        return (root, query, cb) ->
                cb.equal(root.get("priority"), priority);
    }

    // Filter by multiple categories (task has ANY of the specified categories)
    public static Specification<Task> hasCategoryIds(Set<Long> categoryIds) {
        return (root, query, cb) -> {
            if (categoryIds == null || categoryIds.isEmpty()) {
                return cb.conjunction();
            }

            Join<Task, Category> categoryJoin = root.join("categories", JoinType.INNER);
            return categoryJoin.get("id").in(categoryIds);
        };
    }

    public static Specification<Task> isOverdue() {
        return (root, query, cb) -> cb.and(
                cb.lessThan(root.get("dueDate"), LocalDate.now()),
                cb.notEqual(root.get("status"), TaskStatus.COMPLETED),
                cb.notEqual(root.get("status"), TaskStatus.ARCHIVED)
        );
    }

    public static Specification<Task> dueDateAfter(LocalDate from) {
        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("dueDate"), from);
    }

    public static Specification<Task> dueDateBefore(LocalDate to) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("dueDate"), to);
    }

    public static Specification<Task> dueDateBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) ->
                cb.between(root.get("dueDate"), from, to);
    }

    // Search in BOTH title AND description (case-insensitive)
    public static Specification<Task> searchByTitleOrDescription(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
            );
        };
    }

    public static Specification<Task> statusNotIn(TaskStatus... statuses) {
        return (root, query, cb) ->
                cb.not(root.get("status").in((Object[]) statuses));
    }
}