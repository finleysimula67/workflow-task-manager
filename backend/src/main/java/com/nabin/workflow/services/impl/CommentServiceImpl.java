package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.request.CommentRequestDTO;
import com.nabin.workflow.dto.response.CommentResponseDTO;
import com.nabin.workflow.entities.Comment;
import com.nabin.workflow.entities.Task;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.mapper.DTOMapper;
import com.nabin.workflow.repository.CommentRepository;
import com.nabin.workflow.repository.TaskRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.interfaces.ActivityLogService;
import com.nabin.workflow.services.interfaces.CommentService;
import com.nabin.workflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    @Override
    public CommentResponseDTO addComment(Long taskId, CommentRequestDTO commentRequestDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        // Verify task exists and user has access
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setContent(commentRequestDTO.getContent());
        comment.setTask(task);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);

        String summary = "Commented on task: " + task.getTitle();
        activityLogService.logActivity(userId, taskId, "Comment", savedComment.getId(),
                "CREATED", summary, commentRequestDTO.getContent());

        log.info("Comment added to task {} by user {}", taskId, userId);

        return DTOMapper.toCommentResponseDTO(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getTaskComments(Long taskId) {
        Long userId = SecurityUtil.getCurrentUserId();

        // Verify user has access to this task
        taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        List<Comment> comments = commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);

        return comments.stream()
                .map(DTOMapper::toCommentResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponseDTO updateComment(Long commentId, CommentRequestDTO commentRequestDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        Comment comment = commentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found or you don't have permission"));

        comment.setContent(commentRequestDTO.getContent());
        Comment updatedComment = commentRepository.save(comment);

        activityLogService.logActivity(userId, comment.getTask().getId(), "Comment", commentId,
                "UPDATED", "Updated a comment",
                commentRequestDTO.getContent());

        return DTOMapper.toCommentResponseDTO(updatedComment);
    }

    @Override
    public void deleteComment(Long commentId) {
        Long userId = SecurityUtil.getCurrentUserId();

        Comment comment = commentRepository.findByIdAndUserId(commentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found or you don't have permission"));

        Long taskId = comment.getTask().getId();
        commentRepository.delete(comment);

        activityLogService.logActivity(userId, taskId, "Comment", commentId,
                "DELETED", "Deleted a comment", null);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponseDTO getCommentById(Long commentId) {
        Long userId = SecurityUtil.getCurrentUserId();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // Verify user has access to the task
        if (!comment.getTask().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You don't have access to this comment");
        }

        return DTOMapper.toCommentResponseDTO(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public long getCommentCount(Long taskId) {
        Long userId = SecurityUtil.getCurrentUserId();

        // Verify task access
        taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        return commentRepository.countByTaskId(taskId);
    }
}