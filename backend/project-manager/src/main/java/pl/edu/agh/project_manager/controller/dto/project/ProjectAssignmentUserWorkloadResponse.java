package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.controller.dto.common.ChartIntervalResponse;

import java.util.List;

public record ProjectAssignmentUserWorkloadResponse(
        List<ChartIntervalResponse> workload
) {
}
