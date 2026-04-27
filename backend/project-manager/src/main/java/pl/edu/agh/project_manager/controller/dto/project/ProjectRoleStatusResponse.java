package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.ProjectRole;
import pl.edu.agh.project_manager.domain.entity.ProjectRoleSegmentAllocation;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProjectRoleStatusResponse(
        UUID id,
        String roleName,
        String status,
        List<Integer> utilizationPercentages
) {
    public static ProjectRoleStatusResponse from(ProjectRole role) {
        String status = "OPEN";
        
        if (role.getMembers() != null && !role.getMembers().isEmpty()) {
            status = "FILLED";
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
