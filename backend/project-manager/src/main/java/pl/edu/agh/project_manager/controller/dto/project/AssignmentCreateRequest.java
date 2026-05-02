package pl.edu.agh.project_manager.controller.dto.project;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.service.command.project.AssignmentCommand;

import java.time.LocalDate;
import java.util.UUID;

public record AssignmentCreateRequest(
        @NotNull(message = "ID użytkownika nie może być puste")
        UUID userId,

        @NotBlank(message = "Nazwa roli nie może być pusta")
        String roleName,

        @NotNull(message = "Data rozpoczęcia nie może być pusta")
        LocalDate startDate,

        @NotNull(message = "Data zakończenia nie może być pusta")
        LocalDate endDate,

        @NotNull(message = "Utylizacja nie może być pusta")
        @Min(value = 0, message = "Utylizacja musi być większa bądź równa 0")
        @Max(value = 100, message = "Utylizacja musi być mniejsza bądź równa 100")
        Integer utilizationPercentage
) {
    public AssignmentCommand toCommand() {
        return new AssignmentCommand(
                this.userId,
                this.roleName,
                this.startDate,
                this.endDate,
                this.utilizationPercentage
        );
    }
}