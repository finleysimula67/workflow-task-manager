package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.request.CommentRequestDTO;
import com.nabin.workflow.dto.response.CommentResponseDTO;
import com.nabin.workflow.services.interfaces.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/task/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CommentResponseDTO>> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CommentRequestDTO commentRequestDTO) {

        CommentResponseDTO comment = commentService.addComment(taskId, commentRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added successfully", comment));
    }

    @GetMapping("/task/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<CommentResponseDTO>>> getTaskComments(
            @PathVariable Long taskId) {

        List<CommentResponseDTO> comments = commentService.getTaskComments(taskId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved successfully", comments));
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CommentResponseDTO>> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequestDTO commentRequestDTO) {

        CommentResponseDTO comment = commentService.updateComment(commentId, commentRequestDTO);
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", comment));
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }

    @GetMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CommentResponseDTO>> getCommentById(
            @PathVariable Long commentId) {

        CommentResponseDTO comment = commentService.getCommentById(commentId);
        return ResponseEntity.ok(ApiResponse.success("Comment retrieved successfully", comment));
    }

    @GetMapping("/task/{taskId}/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> getCommentCount(@PathVariable Long taskId) {
        long count = commentService.getCommentCount(taskId);
        return ResponseEntity.ok(ApiResponse.success("Comment count retrieved", count));
    }
}