package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.controller.dto.project_group.GroupBasicResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record UserProjectMembershipResponse(
        UUID id,
        String title,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        Boolean isActive,
        GroupBasicResponse group,
        List<UserProjectRoleResponse> roles
) {
    public static UserProjectMembershipResponse from(Project project, List<ProjectAssignment> userAssignments) {
        return new UserProjectMembershipResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getStartDate(),
                project.getEndDate(),
                project.getIsActive(),
                GroupBasicResponse.from(project.getProjectGroup()),
                userAssignments.stream().map(UserProjectRoleResponse::from).toList()
        );
    }

    public record UserProjectRoleResponse(
            String roleName,
            LocalDate startDate,
            LocalDate endDate,
            Integer utilizationPercentage
    ) {
        public static UserProjectRoleResponse from(ProjectAssignment assignment) {
            return new UserProjectRoleResponse(
                    assignment.getRoleName(),
                    assignment.getStartDate(),
                    assignment.getEndDate(),
                    assignment.getUtilizationPercentage()
            );
        }
    }
}
