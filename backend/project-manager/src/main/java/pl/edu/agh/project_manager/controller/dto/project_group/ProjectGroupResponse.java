package pl.edu.agh.project_manager.controller.dto.project_group;

import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProjectGroupResponse(
        UUID id,
        String name,
        List<ProjectResponse> projects
) {
    public static ProjectGroupResponse from(ProjectGroup projectGroup) {
        return new ProjectGroupResponse(
                projectGroup.getId(),
                projectGroup.getName(),
                projectGroup.getProjects().stream().map(ProjectResponse::from).collect(Collectors.toList())
        );
    }
}
