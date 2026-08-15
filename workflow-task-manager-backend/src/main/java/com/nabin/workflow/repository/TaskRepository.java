package com.nabin.workflow.repository;

import com.nabin.workflow.entities.Task;
import com.nabin.workflow.entities.TaskPriority;
import com.nabin.workflow.entities.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

 List<Task> findByUserId(Long userId);

 List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);

 Optional<Task> findByIdAndUserId(Long id, Long userId);

 // Count methods for statistics
 long countByUserId(Long userId);

 long countByUserIdAndStatus(Long userId, TaskStatus status);

 long countByUserIdAndPriority(Long userId, TaskPriority priority);

 //  NEW: Count active tasks (not completed or archived)
 @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId " +
         "AND t.status NOT IN ('COMPLETED', 'ARCHIVED')")
 long countActiveTasksByUserId(@Param("userId") Long userId);

 // NEW: Count overdue tasks
 @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId " +
         "AND t.dueDate < :today " +
         "AND t.status NOT IN ('COMPLETED', 'ARCHIVED')")
 long countOverdueTasksByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

 //NEW: Count tasks due soon
 @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId " +
         "AND t.dueDate BETWEEN :startDate AND :endDate " +
         "AND t.status NOT IN ('COMPLETED', 'ARCHIVED')")
 long countTasksDueSoon(@Param("userId") Long userId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
 // Full-text search using PostgreSQL tsvector
 @Query(value = "SELECT * FROM tasks t WHERE t.user_id = :userId " +
         "AND t.search_vector @@ plainto_tsquery('english', :query) " +
         "ORDER BY ts_rank(t.search_vector, plainto_tsquery('english', :query)) DESC",
         countQuery = "SELECT count(*) FROM tasks t WHERE t.user_id = :userId " +
                 "AND t.search_vector @@ plainto_tsquery('english', :query)",
         nativeQuery = true)
 Page<Task> fullTextSearch(@Param("userId") Long userId, @Param("query") String query, Pageable pageable);

 // Delete method for admin
  void deleteByUserId(Long userId);

  @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = 'COMPLETED' AND t.completedAt >= :start")
  long countCompletedSince(@Param("userId") Long userId, @Param("start") LocalDateTime start);

  @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = 'COMPLETED' AND t.completedAt BETWEEN :start AND :end")
  long countCompletedBetween(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  List<Task> findByUserIdOrderByPositionAsc(Long userId);
}
