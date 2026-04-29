package pl.edu.agh.project_manager.controller.dto.project;

import jakarta.validation.constraints.Size;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;

import java.time.LocalDate;

public record MilestoneUpdateRequest(
        @Size(min = 1, message = "Nazwa nie może być pusta")
        String name,

        String description,

        LocalDate date
) {
    public MilestoneCommand toCommand() {
        return new MilestoneCommand(
                this.name,
                this.description,
                this.date
        );
    }
}
