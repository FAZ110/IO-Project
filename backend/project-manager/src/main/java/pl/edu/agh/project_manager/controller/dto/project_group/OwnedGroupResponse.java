package pl.edu.agh.project_manager.controller.dto.project_group;

import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.UUID;

public record OwnedGroupResponse(
        UUID id,
        String name,
        String description,
        GroupType groupType,
        int projectCount,
        int activeProjectCount,
        boolean isOwner
) {
    public static OwnedGroupResponse from(ProjectGroup group, boolean isOwner) {
        int total = group.getProjects() != null ? group.getProjects().size() : 0;
        int active = group.getProjects() != null
                ? (int) group.getProjects().stream().filter(p -> Boolean.TRUE.equals(p.getIsActive())).count()
                : 0;
        return new OwnedGroupResponse(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getGroupType(),
                total,
                active,
                isOwner
        );
    }
}
