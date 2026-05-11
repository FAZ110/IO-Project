package pl.edu.agh.project_manager.service.command.project;

import java.time.LocalDate;
import java.util.UUID;

public record AssignmentCommand(
        UUID userId,
        String roleName,
        LocalDate startDate,
        LocalDate endDate,
        Integer utilizationPercentage
) {
}