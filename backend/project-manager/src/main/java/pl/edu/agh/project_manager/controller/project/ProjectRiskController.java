package pl.edu.agh.project_manager.controller.project;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project.RiskRequest;
import pl.edu.agh.project_manager.controller.dto.project.RiskResponse;
import pl.edu.agh.project_manager.service.project.ProjectRiskService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/projects/{projectId}/risks")
@RequiredArgsConstructor
public class ProjectRiskController {
    private final ProjectRiskService riskService;

    @PostMapping
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<RiskResponse> createProjectRisk(
            @PathVariable UUID projectId,
            @Valid @RequestBody RiskRequest riskRequest
    ) {
        RiskResponse createdRisk = riskService.createProjectRisk(
                riskRequest.toCommand(), projectId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRisk);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectSecurity.canAccessProject(#projectId, authentication.principal)")
    public ResponseEntity<List<RiskResponse>> getRisks(
            @PathVariable UUID projectId
    ) {
        List<RiskResponse> risks = riskService.getProjectRisks(projectId);
        return ResponseEntity.ok(risks);
    }

    @PatchMapping("/{riskId}")
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<RiskResponse> updateProjectRisk(
            @PathVariable UUID projectId,
            @PathVariable UUID riskId,
            @Valid @RequestBody RiskRequest riskRequest
    ) {
        RiskResponse updatedRisk = riskService.updateProjectRisk(
                projectId,
                riskId,
                riskRequest.toCommand()
        );

        return ResponseEntity.ok(updatedRisk);
    }

    @DeleteMapping("/{riskId}")
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<Void> deleteProjectRisk(
            @PathVariable UUID riskId,
            @PathVariable UUID projectId
    ) {
        riskService.deleteProjectRisk(projectId, riskId);
        return ResponseEntity.noContent().build();
    }
}
