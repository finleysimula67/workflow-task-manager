package com.nabin.workflow.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;  // Stored filename (UUID)

    @Column(nullable = false)
    private String originalFileName;  // User's original filename

    @Column(nullable = false)
    private String fileType;  // MIME type (e.g., image/png, application/pdf)

    @Column(nullable = false)
    private Long fileSize;  // Size in bytes

    @Column(nullable = false)
    private String filePath;  // Storage path

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    // Helper method to get file extension
    public String getFileExtension() {
        int lastDot = originalFileName.lastIndexOf('.');
        return lastDot > 0 ? originalFileName.substring(lastDot + 1).toLowerCase() : "";
    }

    // Helper method to get human-readable file size
    public String getFormattedFileSize() {
        long size = fileSize;
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return String.format("%.2f KB", size / 1024.0);
        if (size < 1024 * 1024 * 1024) return String.format("%.2f MB", size / (1024.0 * 1024.0));
        return String.format("%.2f GB", size / (1024.0 * 1024.0 * 1024.0));
    }
}