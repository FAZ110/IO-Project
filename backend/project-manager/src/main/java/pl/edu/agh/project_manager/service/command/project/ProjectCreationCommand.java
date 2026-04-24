package pl.edu.agh.project_manager.service.command.project;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProjectCreationCommand(
        UUID creatorId,
        String title,
        String description,
        LocalDate startDate,
        Boolean isActive,
        UUID projectGroupId,
        List<RiskCommand> risks,
        List<RoleCommand> roles,
        List<MilestoneCommand> milestones
) {
}
