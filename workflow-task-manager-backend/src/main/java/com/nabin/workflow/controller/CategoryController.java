package com.nabin.workflow.controller;

import com.nabin.workflow.dto.common.ApiResponse;
import com.nabin.workflow.dto.request.CategoryRequestDTO;
import com.nabin.workflow.dto.response.CategoryResponseDTO;
import com.nabin.workflow.services.interfaces.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Create a new category
     * POST /api/categories
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> createCategory(
            @Valid @RequestBody CategoryRequestDTO categoryDTO) {

        log.info("Creating new category: {}", categoryDTO.getName());

        CategoryResponseDTO category = categoryService.createCategory(categoryDTO);

        ApiResponse<CategoryResponseDTO> response = ApiResponse.success(
                "Category created successfully",
                category
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get category by ID
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> getCategoryById(@PathVariable Long id) {
        log.info("Fetching category: {}", id);

        CategoryResponseDTO category = categoryService.getCategoryById(id);

        ApiResponse<CategoryResponseDTO> response = ApiResponse.success(
                "Category retrieved successfully",
                category
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get all categories for current user
     * GET /api/categories
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getAllCategories() {
        log.info("Fetching all categories for current user");

        List<CategoryResponseDTO> categories = categoryService.getAllCategoriesForCurrentUser();

        ApiResponse<List<CategoryResponseDTO>> response = ApiResponse.success(
                "Categories retrieved successfully",
                categories
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Update category
     * PUT /api/categories/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO categoryDTO) {

        log.info("Updating category: {}", id);

        CategoryResponseDTO category = categoryService.updateCategory(id, categoryDTO);

        ApiResponse<CategoryResponseDTO> response = ApiResponse.success(
                "Category updated successfully",
                category
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Delete category
     * DELETE /api/categories/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        log.info("Deleting category: {}", id);

        categoryService.deleteCategory(id);

        ApiResponse<Void> response = ApiResponse.success("Category deleted successfully");

        return ResponseEntity.ok(response);
    }
}