package pl.edu.agh.project_manager.controller.dto.project;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.controller.dto.milestone.MilestoneRequest;
import pl.edu.agh.project_manager.controller.dto.project_risk.ProjectRiskRequest;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProjectCreationRequest(
        @NotBlank(message = "Tytuł projektu nie może być pusty")
        String title,

        @NotBlank(message = "Opis projektu nie może być pusty")
        String description,

        @NotNull(message = "Data rozpoczęcia projektu jest wymagana")
        LocalDate startDate,

        @NotNull(message = "Data zakończenia projektu jest wymagana")
        LocalDate endDate,

        UUID projectGroupId,

        @NotEmpty(message = "Lista sponsorów nie może być pusta")
        List<UUID> sponsors,

        @NotEmpty(message = "Lista członków komitetu sterującego nie może być pusta")
        List<UUID> committee,

        @Valid
        List<ProjectRiskRequest> risks,

        @Valid
        List<MilestoneRequest> milestones
) {
    public ProjectCreationRequest {
        if (risks == null || risks.isEmpty()) risks = List.of();
    }

    public ProjectCreationCommand toCommand(UUID creatorId) {
        return new ProjectCreationCommand(
                creatorId,
                this.title,
                this.description,
                this.startDate,
                this.endDate,
                this.projectGroupId,
                this.risks.stream().map(ProjectRiskRequest::toCommand).toList(),
                this.milestones.stream().map(MilestoneRequest::toCommand).toList(),
                this.sponsors,
                this.committee
        );
    }
}
