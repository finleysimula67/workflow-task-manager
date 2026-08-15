package com.nabin.workflow.services.impl;

import com.nabin.workflow.dto.request.CategoryRequestDTO;
import com.nabin.workflow.dto.response.CategoryResponseDTO;
import com.nabin.workflow.entities.Category;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.DuplicateResourceException;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.mapper.DTOMapper;
import com.nabin.workflow.repository.CategoryRepository;
import com.nabin.workflow.repository.UserRepository;
import com.nabin.workflow.services.interfaces.ActivityLogService;
import com.nabin.workflow.services.interfaces.CategoryService;
import com.nabin.workflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final DTOMapper dtoMapper;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public CategoryResponseDTO createCategory(CategoryRequestDTO categoryDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (categoryRepository.existsByNameAndUserId(categoryDTO.getName(), userId)) {
            throw new DuplicateResourceException("Category", categoryDTO.getName());
        }

        Category category = Category.builder()
                .name(categoryDTO.getName())
                .description(categoryDTO.getDescription())
                .color(categoryDTO.getColor() != null ? categoryDTO.getColor() : "#3B82F6")
                .user(user)
                .build();

        Category savedCategory = categoryRepository.save(category);
        log.info("✅ Category created - ID: {}, Name: {}", savedCategory.getId(), savedCategory.getName());

        activityLogService.logActivity(userId, null, "Category", savedCategory.getId(),
                "CREATED", "Created category: " + savedCategory.getName(),
                "Category color: " + savedCategory.getColor());

        return dtoMapper.toCategoryResponseDTO(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public CategoryResponseDTO getCategoryById(Long categoryId) {
        Long userId = SecurityUtil.getCurrentUserId();

        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        return dtoMapper.toCategoryResponseDTO(category);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<CategoryResponseDTO> getAllCategoriesForCurrentUser() {
        Long userId = SecurityUtil.getCurrentUserId();

        List<Category> categories = categoryRepository.findByUserId(userId);

        return categories.stream()
                .map(dtoMapper::toCategoryResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public CategoryResponseDTO updateCategory(Long categoryId, CategoryRequestDTO categoryDTO) {
        Long userId = SecurityUtil.getCurrentUserId();

        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        if (!category.getName().equals(categoryDTO.getName()) &&
                categoryRepository.existsByNameAndUserId(categoryDTO.getName(), userId)) {
            throw new DuplicateResourceException("Category", categoryDTO.getName());
        }

        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setColor(categoryDTO.getColor());

        Category updatedCategory = categoryRepository.save(category);
        log.info("✅ Category updated - ID: {}", categoryId);

        activityLogService.logActivity(userId, null, "Category", categoryId,
                "UPDATED", "Updated category: " + category.getName(),
                null);

        return dtoMapper.toCategoryResponseDTO(updatedCategory);
    }

    @Override
    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void deleteCategory(Long categoryId) {
        Long userId = SecurityUtil.getCurrentUserId();

        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        String categoryName = category.getName();

        categoryRepository.delete(category);
        log.info("✅ Category deleted - ID: {}", categoryId);

        activityLogService.logActivity(userId, null, "Category", categoryId,
                "DELETED", "Deleted category: " + categoryName,
                null);
    }
}