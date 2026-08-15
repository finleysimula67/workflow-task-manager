package com.nabin.workflow.repository;

import com.nabin.workflow.entities.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {

    List<FileAttachment> findByTaskId(Long taskId);

    Optional<FileAttachment> findByIdAndTaskUserId(Long id, Long userId);

    void deleteByTaskId(Long taskId);
}