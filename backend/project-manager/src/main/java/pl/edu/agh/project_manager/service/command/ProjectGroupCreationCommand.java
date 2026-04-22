package pl.edu.agh.project_manager.service.command;

import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.UUID;

public record ProjectGroupCreationCommand(
        String name,
        String description,
        GroupType groupType,
        UUID ownerId
) {
}
