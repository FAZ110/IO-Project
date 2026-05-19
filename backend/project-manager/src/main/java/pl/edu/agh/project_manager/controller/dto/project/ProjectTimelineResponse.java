package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.controller.dto.milestone.MilestoneResponse;

import java.util.List;

public record ProjectTimelineResponse(
        List<MilestoneResponse> milestones,
        List<AssignmentsByEmployeeResponse> assignments
) {
}
