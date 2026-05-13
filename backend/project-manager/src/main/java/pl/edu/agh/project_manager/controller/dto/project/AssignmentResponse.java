package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentResponse(
        UUID id,
        UUID projectId,
        String projectName,
        String roleName,
        String employeeName,
        String employeeSurname,
        AssignmentStatusResponse status,
        LocalDateTime createdAt
) {
    public static AssignmentResponse from(ProjectAssignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getProject().getId(),
                assignment.getProject().getTitle(),
                assignment.getRoleName(),
                assignment.getUser().getName(),
                assignment.getUser().getSurname(),
                AssignmentStatusResponse.from(assignment.getStatus()),
                assignment.getCreatedAt()
        );
    }
}