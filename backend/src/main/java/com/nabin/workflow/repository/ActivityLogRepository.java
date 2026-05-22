package com.nabin.workflow.repository;

import com.nabin.workflow.entities.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    Page<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<ActivityLog> findTop20ByUserIdOrderByCreatedAtDesc(Long userId);

    List<ActivityLog> findTop20ByOrderByCreatedAtDesc();

    Page<ActivityLog> findByTaskIdOrderByCreatedAtDesc(Long taskId, Pageable pageable);

    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime since);

    void deleteByUserId(Long userId);
}
