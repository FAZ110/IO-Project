package pl.edu.agh.project_manager.service.command.project;


import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProjectCreationCommand(
        String title,
        String description,
        LocalDate startDate,
        UUID projectGroupId,
        UUID projectManagerId,
        List<UUID> sponsors,
        List<UUID> committee,
        List<ProjectSegmentCommand> milestones,
        List<RiskCommand> risks
) {
}
