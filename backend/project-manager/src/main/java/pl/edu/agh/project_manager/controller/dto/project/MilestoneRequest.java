package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;

import java.time.LocalDate;

public record MilestoneRequest(
        String name,
        LocalDate date
) {
     public MilestoneCommand toCommand() {
         return new MilestoneCommand(
                 this.name,
                 this.date
         );
     }
}
