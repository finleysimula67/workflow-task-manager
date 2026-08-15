package com.nabin.workflow.services.interfaces;

import com.nabin.workflow.dto.request.CategoryRequestDTO;
import com.nabin.workflow.dto.response.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    CategoryResponseDTO createCategory(CategoryRequestDTO categoryDTO);
    CategoryResponseDTO getCategoryById(Long categoryId);
    List<CategoryResponseDTO> getAllCategoriesForCurrentUser();
    CategoryResponseDTO updateCategory(Long categoryId, CategoryRequestDTO categoryDTO);
    void deleteCategory(Long categoryId);
}