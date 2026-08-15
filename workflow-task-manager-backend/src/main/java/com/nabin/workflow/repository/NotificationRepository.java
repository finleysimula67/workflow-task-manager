package com.nabin.workflow.repository;

import com.nabin.workflow.entities.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Notification> findTop20ByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.user.id = :userId AND n.isRead = false")
    int markAllAsRead(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.id = :id AND n.user.id = :userId")
    int markAsRead(@Param("id") Long id, @Param("userId") Long userId);

    void deleteByUserId(Long userId);
}
