package pl.edu.agh.project_manager.service.command.project;

import java.time.LocalDate;

public record MilestoneCommand (
    String name,
    LocalDate date
) {

}
