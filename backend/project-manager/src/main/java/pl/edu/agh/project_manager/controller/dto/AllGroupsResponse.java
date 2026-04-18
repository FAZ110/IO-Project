package pl.edu.agh.project_manager.controller.dto;

import java.util.List;

public record AllGroupsResponse(
        List<SingleGroupResponse> wallets,
        List<SingleGroupResponse> programs
) {
}
