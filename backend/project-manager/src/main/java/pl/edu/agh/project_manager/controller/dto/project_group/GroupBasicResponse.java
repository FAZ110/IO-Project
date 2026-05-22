package pl.edu.agh.project_manager.controller.dto.project_group;

import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.UUID;

public record GroupBasicResponse(
        UUID id,
        String name,
        GroupType groupType
) {
    public static GroupBasicResponse from(ProjectGroup group) {
        if (group == null) {
            return null;
        }
        return new GroupBasicResponse(
                group.getId(),
                group.getName(),
                group.getGroupType()
        );
    }
}