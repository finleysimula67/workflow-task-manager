package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.request.TaskTemplateRequestDTO;
import com.nabin.workflow.dto.response.TaskTemplateResponseDTO;

import java.util.List;

public interface TaskTemplateService {
    TaskTemplateResponseDTO createTemplate(TaskTemplateRequestDTO dto);
    List<TaskTemplateResponseDTO> getTemplates();
    TaskTemplateResponseDTO updateTemplate(Long id, TaskTemplateRequestDTO dto);
    void deleteTemplate(Long id);
}
