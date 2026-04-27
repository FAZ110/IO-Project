package pl.edu.agh.project_manager.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project.ProjectRoleStatusResponse;
import pl.edu.agh.project_manager.service.ProjectRoleService;

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
}
