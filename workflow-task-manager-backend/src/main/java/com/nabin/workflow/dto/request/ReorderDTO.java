package com.nabin.workflow.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderDTO {
    @NotNull
    private List<OrderEntry> order;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderEntry {
        @NotNull
        private Long id;
        private int position;
    }
}
