package pl.edu.agh.project_manager.controller.project;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project.*;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.command.project.SearchProjectCommand;
import pl.edu.agh.project_manager.service.project.ProjectService;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<UUID> createProject(
            @Valid @RequestBody ProjectCreationRequest projectCreationRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        ProjectCreationCommand command = projectCreationRequest.toCommand(userPrincipal.userId());
        UUID newProjectId = projectService.createProject(command);

        return ResponseEntity.status(HttpStatus.CREATED).body(newProjectId);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'AUTHORITY', 'LINEAR_MANAGER', 'COMMON', 'ADMINISTRATOR')")
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "groupId", required = false) UUID groupId,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "unassignedOnly", required = false, defaultValue = "false") Boolean unassignedOnly
    ) {
        SearchProjectCommand command = new SearchProjectCommand(
                userPrincipal,
                query,
                groupId,
                isActive,
                unassignedOnly
        );
        return ResponseEntity.ok(projectService.searchProjects(command));
    }

    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectAccess.canAccessProject(#projectId, authentication.principal)")
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable UUID projectId
    ) {
        ProjectResponse project = projectService.getProject(projectId);
        return ResponseEntity.ok(project);
    }

    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectAccess.canAccessProject(#projectId, authentication.principal)")
    @GetMapping("/{projectId}/members")
    public ResponseEntity<ProjectMembersResponse> getProjectMembers(
            @PathVariable UUID projectId
    ) {
        ProjectMembersResponse project = projectService.getProjectMembers(projectId);
        return ResponseEntity.ok(project);
    }
}



