package pl.edu.agh.project_manager.controller.dto.project_group;

import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import java.util.List;

public record AllGroupsResponse(
        List<ProjectGroupResponse> wallets,
        List<ProjectGroupResponse> programs,
        List<ProjectResponse> unassigned
) {
}
