package pl.edu.agh.project_manager.controller.dto;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

public record PagedResponse<T>(
        List<T> items,
        long totalCount,
        int pageNumber,
        int pageSize,
        int totalPages,
        boolean hasNextPage,
        boolean hasPreviousPage
) {
    public static <E, T> PagedResponse<T> from(Page<E> page, Function<E, T> mapper) {
        return new PagedResponse<>(
                page.getContent().stream().map(mapper).toList(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
}
