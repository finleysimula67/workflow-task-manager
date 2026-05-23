package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.request.TaskTemplateRequestDTO;
import com.nabin.workflow.dto.response.TaskTemplateResponseDTO;
import com.nabin.workflow.services.interfaces.TaskTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-templates")
@RequiredArgsConstructor
@Slf4j
public class TaskTemplateController {

    private final TaskTemplateService taskTemplateService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TaskTemplateResponseDTO>> createTemplate(
            @Valid @RequestBody TaskTemplateRequestDTO dto) {
        TaskTemplateResponseDTO template = taskTemplateService.createTemplate(dto);
        return new ResponseEntity<>(ApiResponse.success("Template created", template), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TaskTemplateResponseDTO>>> getTemplates() {
        List<TaskTemplateResponseDTO> templates = taskTemplateService.getTemplates();
        return ResponseEntity.ok(ApiResponse.success("Templates retrieved", templates));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TaskTemplateResponseDTO>> updateTemplate(
            @PathVariable Long id, @Valid @RequestBody TaskTemplateRequestDTO dto) {
        TaskTemplateResponseDTO template = taskTemplateService.updateTemplate(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Template updated", template));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable Long id) {
        taskTemplateService.deleteTemplate(id);
        return ResponseEntity.ok(ApiResponse.success("Template deleted"));
    }
}
