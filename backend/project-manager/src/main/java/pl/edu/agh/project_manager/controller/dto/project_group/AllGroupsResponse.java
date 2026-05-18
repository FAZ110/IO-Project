package pl.edu.agh.project_manager.controller.dto.project_group;

import java.util.List;

public record AllGroupsResponse(
        List<ProjectGroupResponse> wallets,
        List<ProjectGroupResponse> programs
) {
}
