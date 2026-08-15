package com.nabin.workflow.dto.common;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageMetadata {

    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;
    private boolean first;
    private boolean last;
    private boolean empty;

    /**
     * Create metadata from Spring Page object
     */
    public static PageMetadata from(Page<?> page) {
        return PageMetadata.builder()
                .currentPage(page.getNumber())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .pageSize(page.getSize())
                .first(page.isFirst())
                .last(page.isLast())
                .empty(page.isEmpty())
                .build();
    }
}