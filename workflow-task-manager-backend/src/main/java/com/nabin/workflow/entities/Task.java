package com.nabin.workflow.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ✅ Many-to-Many relationship with Categories
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "task_categories",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(nullable = true)
    @Builder.Default
    private Integer position = 0;

    // Helper methods
    public boolean isOverdue() {
        if (dueDate == null || status == TaskStatus.COMPLETED || status == TaskStatus.ARCHIVED) {
            return false;
        }
        return LocalDate.now().isAfter(dueDate);
    }

    public boolean canTransitionTo(TaskStatus newStatus) {
        if (status == newStatus) {
            return true;
        }

        return switch (status) {
            case TODO -> newStatus == TaskStatus.IN_PROGRESS ||
                    newStatus == TaskStatus.ARCHIVED;

            case IN_PROGRESS -> newStatus == TaskStatus.TODO ||
                    newStatus == TaskStatus.COMPLETED ||
                    newStatus == TaskStatus.ARCHIVED;

            case COMPLETED -> newStatus == TaskStatus.TODO ||
                    newStatus == TaskStatus.ARCHIVED;

            case ARCHIVED -> false;
        };
    }

    //
    public void addCategory(Category category) {
        this.categories.add(category);
        category.getTasks().add(this);
    }

    public void removeCategory(Category category) {
        this.categories.remove(category);
        category.getTasks().remove(this);
    }

    public void clearCategories() {
        for (Category category : new HashSet<>(categories)) {
            removeCategory(category);
        }
    }
    // Add this field
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FileAttachment> attachments = new ArrayList<>();

    // Add helper methods
    public void addAttachment(FileAttachment attachment) {
        attachments.add(attachment);
        attachment.setTask(this);
    }

    public void removeAttachment(FileAttachment attachment) {
        attachments.remove(attachment);
        attachment.setTask(null);
    }

    @Builder.Default
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<Comment> comments = new ArrayList<>();

    // Helper methods
    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setTask(this);
    }

    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setTask(null);
    }
}