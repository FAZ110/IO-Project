package pl.edu.agh.project_manager.controller.dto.project;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.service.command.project.ProjectSegmentCommand;

import java.time.LocalDate;

public record ProjectSegmentRequest(
        @NotNull(message = "Data początkowa milestone'a nie może być pusta")
        @FutureOrPresent(message = "Data początkowa milestone'a musi być z przyszłości")
        LocalDate startDate,

        @NotNull(message = "Data końcowa milestone'a nie może być pusta")
        @Future(message = "Data końcowa milestone'a musi być z przyszłości")
        LocalDate endDate
) {
    public ProjectSegmentCommand toCommand() {
        return new ProjectSegmentCommand(this.startDate, this.endDate);
    }
}
