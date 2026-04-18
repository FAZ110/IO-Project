package pl.edu.agh.project_manager.service.command;


import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProjectCreationCommand(
        String title,
        String description,
        LocalDate startDate,
        Boolean isActive,
        UUID projectGroupId,
        UUID projectManagerId,
        List<RiskCommand> risks
) {
}
