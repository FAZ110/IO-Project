package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project.*;
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
        List<ProjectResponse> projects = projectService.getAccessibleProjects(userPrincipal);
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

    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectSecurity.canAccessProject(#projectId, authentication.principal)")
    @GetMapping("/{projectId}/members")
    public ResponseEntity<ProjectMembersResponse> getProjectMembers(
            @PathVariable UUID projectId
    ) {
        ProjectMembersResponse project = projectService.getProjectMembers(projectId);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/{projectId}/risks")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectSecurity.canAccessProject(#projectId, authentication.principal)")
    public ResponseEntity<List<RiskResponse>> getRisks(
            @PathVariable UUID projectId
    ) {
        List<RiskResponse> risks = projectService.getProjectRisks(projectId);
        return ResponseEntity.ok(risks);
    }

    @DeleteMapping("/{projectId}/risks/{riskId}")
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<Void> deleteProjectRisk(
            @PathVariable UUID riskId,
            @PathVariable UUID projectId
    ) {
        projectService.deleteProjectRisk(projectId, riskId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{projectId}/risks/{riskId}")
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

    @PostMapping("/{projectId}/risks")
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
}