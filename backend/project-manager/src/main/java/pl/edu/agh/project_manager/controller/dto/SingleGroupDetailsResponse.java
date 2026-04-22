package pl.edu.agh.project_manager.controller.dto;

import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.UUID;

public record SingleGroupDetailsResponse(
        UUID id,
        String name,
        String description,
        User owner,
        GroupType groupType
) {
}
