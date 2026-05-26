package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.entity.user.User;

import java.util.List;
import java.util.UUID;

public record AssignmentsByEmployeeResponse(
        UUID userId,
        String name,
        String surname,
        String email,
        List<ProjectAssignmentResponse> assignments
) {
    public static AssignmentsByEmployeeResponse from(User user, List<ProjectAssignment> userAssignments) {
        return new AssignmentsByEmployeeResponse(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                userAssignments.stream()
                        .map(ProjectAssignmentResponse::from)
                        .toList()
        );
    }
}
