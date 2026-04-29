package pl.edu.agh.project_manager.controller.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;

import java.time.LocalDate;

public record MilestoneRequest(
        @NotBlank(message = "Nazwa nie może być pusta")
        String name,

        String description,

        @NotNull(message = "Kamień milowy musi mieć datę")
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
