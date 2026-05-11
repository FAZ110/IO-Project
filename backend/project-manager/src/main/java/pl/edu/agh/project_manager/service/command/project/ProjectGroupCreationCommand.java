package pl.edu.agh.project_manager.service.command.project;

import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.List;
import java.util.UUID;

public record ProjectGroupCreationCommand(
        String name,
        String description,
        GroupType groupType,
        List<UUID> projectIds,
        UUID ownerId
) {
}
