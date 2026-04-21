package pl.edu.agh.project_manager.controller.dto;

import pl.edu.agh.project_manager.controller.dto.project_group.SingleGroupResponse;

import java.util.List;

public record AllGroupsResponse(
        List<SingleGroupResponse> wallets,
        List<SingleGroupResponse> programs
) {
}
