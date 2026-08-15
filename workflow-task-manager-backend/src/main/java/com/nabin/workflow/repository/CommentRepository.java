package com.nabin.workflow.repository;

import com.nabin.workflow.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTaskIdOrderByCreatedAtDesc(Long taskId);

    Optional<Comment> findByIdAndUserId(Long id, Long userId);

    List<Comment> findByTaskIdAndTaskUserId(Long taskId, Long userId);

    long countByTaskId(Long taskId);

    void deleteByTaskId(Long taskId);
}