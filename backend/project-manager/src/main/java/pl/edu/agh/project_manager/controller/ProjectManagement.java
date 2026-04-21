package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project.ProjectCreationRequest;
import pl.edu.agh.project_manager.controller.dto.project.RiskRequest;
import pl.edu.agh.project_manager.controller.dto.RiskResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.ProjectService;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProjectManagement {
    private final ProjectService projectService;

    @PostMapping("/project")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<UUID> createProject(
            @Valid @RequestBody ProjectCreationRequest projectCreationRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        ProjectCreationCommand command = projectCreationRequest.toCommand(userPrincipal.userId());
        UUID newProjectId = projectService.createProject(command);

        // Return ID of project
        return ResponseEntity.status(HttpStatus.CREATED).body(newProjectId);
    }

    @DeleteMapping("/project/{projectId}/risk/{riskId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Void> deleteProjectRisk(
            @PathVariable UUID riskId,
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        projectService.deleteProjectRisk(projectId, riskId, userPrincipal.userId());
        return  ResponseEntity.noContent().build();
    }

    @PatchMapping("/project/{projectId}/risk/{riskId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<RiskResponse> updateProjectRisk(
            @PathVariable UUID projectId,
            @PathVariable UUID riskId,
            @Valid @RequestBody RiskRequest riskRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        RiskResponse updatedRisk = projectService.updateProjectRisk(
                projectId,
                riskId,
                userPrincipal.userId(),
                riskRequest.toCommand()
        );

        return ResponseEntity.ok(updatedRisk);
    }

    @PostMapping("/project/{projectId}/risk")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<RiskResponse> createProjectRisk(
            @PathVariable UUID projectId,
            @Valid @RequestBody RiskRequest riskRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        RiskResponse createdRisk = projectService.createProjectRisk(
                riskRequest.toCommand(), userPrincipal.userId(), projectId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRisk);
    }
}
