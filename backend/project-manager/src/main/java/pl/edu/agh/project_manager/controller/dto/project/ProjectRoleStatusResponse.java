package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.AllocationRequest;
import pl.edu.agh.project_manager.domain.entity.ProjectRole;
import pl.edu.agh.project_manager.domain.enums.AllocationRequestStatus;

import java.util.UUID;

public record ProjectRoleStatusResponse(
        UUID id,
        String roleName,
        String status
) {
    public static ProjectRoleStatusResponse from(ProjectRole role) {
        String status = "OPEN";
        
        if (role.getMembers() != null && !role.getMembers().isEmpty()) {
            status = "FILLED";
        } else if (role.getAllocationRequests() != null && 
                   role.getAllocationRequests().stream().anyMatch(req -> req.getStatus() == AllocationRequestStatus.SUBMITTED)) {
            status = "PENDING";
        }

        return new ProjectRoleStatusResponse(
                role.getId(),
                role.getRoleName(),
                status
        );
    }
}
