package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.request.TaskTemplateRequestDTO;
import com.nabin.workflow.dto.response.TaskTemplateResponseDTO;
import com.nabin.workflow.entities.TaskTemplate;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.repository.TaskTemplateRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.interfaces.TaskTemplateService;
import com.nabin.workflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskTemplateServiceImpl implements TaskTemplateService {

    private final TaskTemplateRepository templateRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TaskTemplateResponseDTO createTemplate(TaskTemplateRequestDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        TaskTemplate template = TaskTemplate.builder()
                .user(user)
                .name(dto.getName())
                .titlePrefix(dto.getTitlePrefix() != null ? dto.getTitlePrefix() : "")
                .description(dto.getDescription())
                .priority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM")
                .categoryIds(dto.getCategoryIds())
                .build();

        TaskTemplate saved = templateRepository.save(template);
        return toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskTemplateResponseDTO> getTemplates() {
        Long userId = SecurityUtil.getCurrentUserId();
        return templateRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskTemplateResponseDTO updateTemplate(Long id, TaskTemplateRequestDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        TaskTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TaskTemplate", "id", id));

        if (!template.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        template.setName(dto.getName());
        template.setTitlePrefix(dto.getTitlePrefix() != null ? dto.getTitlePrefix() : "");
        template.setDescription(dto.getDescription());
        template.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        template.setCategoryIds(dto.getCategoryIds());

        TaskTemplate saved = templateRepository.save(template);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteTemplate(Long id) {
        Long userId = SecurityUtil.getCurrentUserId();
        TaskTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TaskTemplate", "id", id));

        if (!template.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        templateRepository.delete(template);
    }

    private TaskTemplateResponseDTO toDTO(TaskTemplate t) {
        return TaskTemplateResponseDTO.builder()
                .id(t.getId())
                .name(t.getName())
                .titlePrefix(t.getTitlePrefix())
                .description(t.getDescription())
                .priority(t.getPriority())
                .categoryIds(t.getCategoryIds())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
