package pl.edu.agh.project_manager.controller.dto.project;

import java.util.UUID;

public record RiskResponse(
        UUID id,
        String name,
        String description,
        Integer probability
) {
}
