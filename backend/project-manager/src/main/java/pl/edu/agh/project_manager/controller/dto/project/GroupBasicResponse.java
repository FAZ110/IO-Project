package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import java.util.UUID;

public record GroupBasicResponse(
        UUID id,
        String name,
        String groupType
) {
    public static GroupBasicResponse from(ProjectGroup group) {
        if (group == null) {
            return null;
        }
        return new GroupBasicResponse(
                group.getId(),
                group.getName(),
                group.getGroupType().name()
        );
    }
}