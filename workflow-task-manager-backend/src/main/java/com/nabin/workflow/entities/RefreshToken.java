package com.nabin.workflow.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean revoked = false;

    // Device/browser info for security
    @Column(length = 255)
    private String userAgent;

    @Column(length = 45)
    private String ipAddress;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }

    public boolean isRevoked() {
        return revoked != null && revoked;
    }
}
