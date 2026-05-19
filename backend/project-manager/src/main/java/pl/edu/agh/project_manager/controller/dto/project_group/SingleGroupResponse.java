package pl.edu.agh.project_manager.controller.dto.project_group;

import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.UUID;

public record SingleGroupResponse (
        UUID id,
        String name,
        GroupType groupType
) {
}
