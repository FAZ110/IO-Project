package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.ProjectRole;
import pl.edu.agh.project_manager.domain.entity.ProjectRoleSegmentAllocation;
import pl.edu.agh.project_manager.domain.enums.AllocationRequestStatus;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProjectRoleStatusResponse(
        UUID id,
        String roleName,
        String status, // OPEN, PENDING, FILLED
        List<Integer> utilizationPercentages
) {
    public static ProjectRoleStatusResponse from(ProjectRole role) {
        String status = "OPEN";
        
        if (role.getMembers() != null && !role.getMembers().isEmpty()) {
            status = "FILLED";
        } else if (role.getAllocationRequests() != null && 
                   role.getAllocationRequests().stream().anyMatch(req -> req.getStatus() == AllocationRequestStatus.SUBMITTED)) {
            status = "PENDING";
        }

        List<Integer> utilizations = role.getSegmentAllocations().stream()
                .map(ProjectRoleSegmentAllocation::getUtilizationPercentage)
                .collect(Collectors.toList());

        return new ProjectRoleStatusResponse(
                role.getId(),
                role.getRoleName(),
                status,
                utilizations
        );
    }
}
