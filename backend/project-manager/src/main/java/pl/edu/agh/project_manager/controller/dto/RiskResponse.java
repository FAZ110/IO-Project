package pl.edu.agh.project_manager.controller.dto;

import java.util.UUID;

public record RiskResponse(
        UUID id,
        String name,
        String description,
        Integer probability
) {
}
