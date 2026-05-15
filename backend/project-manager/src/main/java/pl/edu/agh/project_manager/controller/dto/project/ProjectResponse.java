package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.controller.dto.user.UserResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        String title,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        Boolean isActive,
        UserResponse manager,
        UUID groupId
) {
    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getStartDate(),
                project.getEndDate(),
                project.getIsActive(),
                UserResponse.from(project.getProjectManager()),
                project.getProjectGroup() != null ? project.getProjectGroup().getId() : null
        );
    }
}