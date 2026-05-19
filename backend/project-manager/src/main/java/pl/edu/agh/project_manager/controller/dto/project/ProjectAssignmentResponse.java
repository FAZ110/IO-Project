package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectAssignmentResponse(
        UUID id,
        LocalDate startDate,
        LocalDate endDate,
        AssignmentStatusResponse status,
        String roleName,
        int utilizationPercentage
) {
    public static ProjectAssignmentResponse from(ProjectAssignment assignment) {
        return new ProjectAssignmentResponse(
                assignment.getId(),
                assignment.getStartDate(),
                assignment.getEndDate(),
                AssignmentStatusResponse.from(assignment.getStatus()),
                assignment.getRoleName(),
                assignment.getUtilizationPercentage()
        );
    }
}
