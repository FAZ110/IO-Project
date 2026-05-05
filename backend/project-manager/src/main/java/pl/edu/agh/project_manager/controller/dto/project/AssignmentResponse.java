package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentResponse(
        UUID id,
        UUID projectId,
        UUID userId,
        String roleName,
        LocalDate startDate,
        LocalDate endDate,
        Integer utilizationPercentage,
        AssignmentStatus status,
        LocalDateTime createdAt
) {
    public static AssignmentResponse from(ProjectAssignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getProject().getId(),
                assignment.getUser().getId(),
                assignment.getRoleName(),
                assignment.getStartDate(),
                assignment.getEndDate(),
                assignment.getUtilizationPercentage(),
                assignment.getStatus(),
                assignment.getCreatedAt()
        );
    }
}