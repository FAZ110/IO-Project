package pl.edu.agh.project_manager.controller.dto.vacancy;

import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.service.command.vacancy.CreateVacancyCommand;

import java.time.LocalDate;
import java.util.UUID;

public record CreateVacancyRequest(
        @NotNull(message = "Role ID cannot be null")
        UUID roleId,
        
        LocalDate startDate,
        
        LocalDate endDate
) {
    public CreateVacancyCommand toCommand(UUID projectId) {
        return new CreateVacancyCommand(projectId, roleId, startDate, endDate);
    }
}
