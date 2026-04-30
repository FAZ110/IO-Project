package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.entity.ProjectRole;
import pl.edu.agh.project_manager.domain.entity.ProjectRoleSegmentAllocation;
import pl.edu.agh.project_manager.domain.enums.MembershipStatus;
import pl.edu.agh.project_manager.domain.enums.ProjectRoleStatus;

import java.util.List;
import java.util.UUID;

public record ProjectRoleStatusResponse(
        UUID id,
        String roleName,
        ProjectRoleStatus status,
        List<Integer> utilizationPercentages
) {
    public static ProjectRoleStatusResponse from(ProjectRole role) {
        ProjectRoleStatus currentStatus = ProjectRoleStatus.OPEN;

        if (role.getMembers() != null && !role.getMembers().isEmpty()) {
            
            boolean isFilled = role.getMembers().stream()
                    .anyMatch(member -> member.getMembershipStatus() == MembershipStatus.ACCEPTED);
            
            boolean isPending = role.getMembers().stream()
                    .anyMatch(member -> member.getMembershipStatus() == MembershipStatus.PENDING);

            if (isFilled) {
                currentStatus = ProjectRoleStatus.FILLED;
            } else if (isPending) {
                currentStatus = ProjectRoleStatus.PENDING;
            }
        }

        List<Integer> utilizations = role.getSegmentAllocations().stream()
                .map(ProjectRoleSegmentAllocation::getUtilizationPercentage)
                .toList();

        return new ProjectRoleStatusResponse(
                role.getId(),
                role.getRoleName(),
                currentStatus,
                utilizations
        );
    }
}