package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.allocationrequest.AllocationRequestResponse;
import pl.edu.agh.project_manager.controller.dto.allocationrequest.CreateAllocationRequest;
import pl.edu.agh.project_manager.controller.dto.project.ProjectRoleStatusResponse;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.ProjectRoleService;
import pl.edu.agh.project_manager.service.command.allocationrequest.CreateAllocationRequestCommand;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProjectRoleController {
    private final ProjectRoleService projectRoleService;

    @GetMapping("/projects/{projectId}/roles/status")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectSecurity.canAccessProject(#projectId, authentication.principal)")
    public ResponseEntity<List<ProjectRoleStatusResponse>> getProjectRolesStatus(
            @PathVariable UUID projectId
    ) {
        List<ProjectRoleStatusResponse> roles = projectRoleService.getProjectRolesStatus(projectId);
        return ResponseEntity.ok(roles);
    }

    @PostMapping("/roles/{roleId}/allocation-requests")
    @PreAuthorize("hasRole('PROJECT_MANAGER') and @projectSecurity.canManageRole(#roleId, authentication.principal)")
    public ResponseEntity<AllocationRequestResponse> createAllocationRequest(
            @PathVariable UUID roleId,
            @Valid @RequestBody CreateAllocationRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        // Jawne tworzenie komendy z roleId z path, aby uniknąć problemów z null w DTO
        CreateAllocationRequestCommand command = new CreateAllocationRequestCommand(
                roleId,
                request.requestedEmployeeId(),
                userPrincipal.userId(),
                request.justification()
        );
        
        AllocationRequestResponse createdRequest = projectRoleService.createAllocationRequest(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }
}
