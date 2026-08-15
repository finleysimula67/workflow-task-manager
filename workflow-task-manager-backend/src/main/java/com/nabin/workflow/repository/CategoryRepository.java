package com.nabin.workflow.repository;

import com.nabin.workflow.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserId(Long userId);

    Optional<Category> findByIdAndUserId(Long id, Long userId);

    boolean existsByNameAndUserId(String name, Long userId);

    long countByUserId(Long userId);

    void deleteByUserId(Long userId);

    // Find categories by IDs and user
    Set<Category> findByIdInAndUserId(Set<Long> ids, Long userId);
}