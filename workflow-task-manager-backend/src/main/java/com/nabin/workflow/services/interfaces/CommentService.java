package com.nabin.workflow.services.interfaces;


import com.nabin.workflow.dto.request.CommentRequestDTO;
import com.nabin.workflow.dto.response.CommentResponseDTO;
import java.util.List;

public interface CommentService {

    CommentResponseDTO addComment(Long taskId, CommentRequestDTO commentRequestDTO);

    List<CommentResponseDTO> getTaskComments(Long taskId);

    CommentResponseDTO updateComment(Long commentId, CommentRequestDTO commentRequestDTO);

    void deleteComment(Long commentId);

    CommentResponseDTO getCommentById(Long commentId);

    long getCommentCount(Long taskId);
}