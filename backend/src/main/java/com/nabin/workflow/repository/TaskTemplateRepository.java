package com.nabin.workflow.repository;

import com.nabin.workflow.entities.TaskTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskTemplateRepository extends JpaRepository<TaskTemplate, Long> {
    List<TaskTemplate> findByUserIdOrderByCreatedAtDesc(Long userId);
}
