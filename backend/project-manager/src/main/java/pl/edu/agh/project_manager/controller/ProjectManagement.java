package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project.ProjectCreationRequest;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.controller.dto.project.RiskRequest;
import pl.edu.agh.project_manager.controller.dto.project.RiskResponse;
import pl.edu.agh.project_manager.controller.dto.project.ProjectRoleRequest;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.ProjectService;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectManagement {
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
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<ProjectResponse> projects = projectService.getAllProjects(userPrincipal);
        return ResponseEntity.ok(projects);
    }

    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectSecurity.canAccessProject(#projectId, authentication.principal)")
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable UUID projectId
    ) {
        ProjectResponse project = projectService.getProject(projectId);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{projectId}/risk/{riskId}")
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<Void> deleteProjectRisk(
            @PathVariable UUID riskId,
            @PathVariable UUID projectId
    ) {
        projectService.deleteProjectRisk(projectId, riskId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{projectId}/risk/{riskId}")
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<RiskResponse> updateProjectRisk(
            @PathVariable UUID projectId,
            @PathVariable UUID riskId,
            @Valid @RequestBody RiskRequest riskRequest
    ) {
        RiskResponse updatedRisk = projectService.updateProjectRisk(
                projectId,
                riskId,
                riskRequest.toCommand()
        );

        return ResponseEntity.ok(updatedRisk);
    }

    @PostMapping("/{projectId}/risk")
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<RiskResponse> createProjectRisk(
            @PathVariable UUID projectId,
            @Valid @RequestBody RiskRequest riskRequest
    ) {
        RiskResponse createdRisk = projectService.createProjectRisk(
                riskRequest.toCommand(), projectId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRisk);
    }

    @PostMapping("/{projectId}/roles")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Void> createProjectRole(
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectRoleRequest roleRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        projectService.createProjectRole(projectId, userPrincipal.userId(), roleRequest.toCommand());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}