package pl.edu.agh.project_manager.controller.dto.project;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

        @NotNull(message = "Aktywność projektu nie może być pusta")
        Boolean isActive,

        UUID projectGroupId,

        @Valid
        List<RiskRequest> risks,

        List<RoleRequest> roles,

        @NotEmpty(message = "Lista kamieni milowych nie może być pusta")
        List<LocalDateTime> milestones
) {
    // By default, project is active and list with risks is empty
    public ProjectCreationRequest {
        if (isActive == null) isActive = true;

        if (risks.isEmpty()) risks = List.of();
    }

    public ProjectCreationCommand toCommand(UUID projectManagerId) {
        return new ProjectCreationCommand(
                this.title,
                this.description,
                this.startDate,
                this.isActive,
                this.projectGroupId,
                projectManagerId,
                this.risks.stream().map(RiskRequest::toCommand).toList(),
                this.roles.stream().map(RoleRequest::toCommand).toList(),
                milestones
        );
    }
}
