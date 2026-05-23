package pl.edu.agh.project_manager.controller.dto.project.projectrisk;

import pl.edu.agh.project_manager.domain.entity.project.ProjectRisk;

import java.util.UUID;

public record ProjectRiskResponse(
        UUID id,
        String name,
        String description,
        Integer probability,
        Integer impact,
        Integer value
) {
    public static ProjectRiskResponse from(ProjectRisk risk) {
        return new ProjectRiskResponse(
                risk.getId(),
                risk.getName(),
                risk.getDescription(),
                risk.getProbability(),
                risk.getImpact(),
                risk.getProbability() * risk.getImpact()
        );
    }
}
