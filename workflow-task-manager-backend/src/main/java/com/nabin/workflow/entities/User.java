package com.nabin.workflow.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false , unique = true , length = 50)
    private String username;

    @Column(nullable = false , unique = true , length = 100)
    private String email;

    @Column(length = 200)
    private String password;

    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(length = 255)
    private String providerId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Task> tasks = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

}
