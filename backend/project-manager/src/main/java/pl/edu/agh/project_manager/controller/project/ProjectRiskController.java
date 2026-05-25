package pl.edu.agh.project_manager.controller.project;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project.projectrisk.ProjectRiskRequest;
import pl.edu.agh.project_manager.controller.dto.project.projectrisk.ProjectRiskResponse;
import pl.edu.agh.project_manager.service.project.ProjectRiskService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/projects/{projectId}/risks")
@RequiredArgsConstructor
public class ProjectRiskController {
    private final ProjectRiskService riskService;

    @PostMapping
    @PreAuthorize("@projectAccess.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<ProjectRiskResponse> createProjectRisk(
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectRiskRequest riskRequest
    ) {
        ProjectRiskResponse createdRisk = riskService.createProjectRisk(
                riskRequest.toCommand(), projectId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRisk);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'AUTHORITY') or @projectAccess.canAccessProject(#projectId, authentication.principal)")
    public ResponseEntity<List<ProjectRiskResponse>> getRisks(
            @PathVariable UUID projectId
    ) {
        List<ProjectRiskResponse> risks = riskService.getProjectRisks(projectId);
        return ResponseEntity.ok(risks);
    }

    @PatchMapping("/{riskId}")
    @PreAuthorize("@projectAccess.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<ProjectRiskResponse> updateProjectRisk(
            @PathVariable UUID projectId,
            @PathVariable UUID riskId,
            @Valid @RequestBody ProjectRiskRequest riskRequest
    ) {
        ProjectRiskResponse updatedRisk = riskService.updateProjectRisk(
                projectId,
                riskId,
                riskRequest.toCommand()
        );

        return ResponseEntity.ok(updatedRisk);
    }

    @DeleteMapping("/{riskId}")
    @PreAuthorize("@projectAccess.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<Void> deleteProjectRisk(
            @PathVariable UUID riskId,
            @PathVariable UUID projectId
    ) {
        riskService.deleteProjectRisk(projectId, riskId);
        return ResponseEntity.noContent().build();
    }
}
