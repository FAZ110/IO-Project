package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.ProjectRisk;

import java.util.UUID;

public record RiskResponse(
        UUID id,
        String name,
        String description,
        Integer probability
) {
    public static RiskResponse from(ProjectRisk risk) {
        return new RiskResponse(
                risk.getId(),
                risk.getName(),
                risk.getDescription(),
                risk.getProbability()
        );
    }
}
