package pl.edu.agh.project_manager.controller.dto.project;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProjectCreationRequest(
        @NotBlank(message = "Tytuł projektu nie może być pusty")
        String title,

        @NotBlank(message = "Opis projektu nie może być pusty")
        String description,

        @NotNull(message = "Data początkowa nie może być pusta")
        @FutureOrPresent(message = "Data początkowa musi być z przyszłości")
        LocalDate startDate,

        UUID projectGroupId,

        @NotNull(message = "Lista sponsorów nie może być pusta")
        List<UUID> sponsors,

        @NotNull(message = "Lista członków komitetu sterującego nie może być pusta")
        List<UUID> committee,

        @Valid
        List<RiskRequest> risks,

        @Valid
        List<RoleRequest> roles,

        @NotEmpty(message = "Lista kamieni milowych nie może być pusta")
        List<@Valid MilestoneRequest> milestones
) {
    public ProjectCreationRequest {
        if (risks.isEmpty()) risks = List.of();
    }

    public ProjectCreationCommand toCommand(UUID creatorId) {
        return new ProjectCreationCommand(
                creatorId,
                this.title,
                this.description,
                this.startDate,
                true,
                this.projectGroupId,
                this.risks.stream().map(RiskRequest::toCommand).toList(),
                this.roles.stream().map(RoleRequest::toCommand).toList(),
                this.milestones.stream().map(MilestoneRequest::toCommand).toList(),
                this.sponsors,
                this.committee
        );
    }
}
