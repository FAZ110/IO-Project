package pl.edu.agh.project_manager.controller.dto.project;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        String title,
        String description,
        LocalDate startDate,
        Boolean isActive
) {
}