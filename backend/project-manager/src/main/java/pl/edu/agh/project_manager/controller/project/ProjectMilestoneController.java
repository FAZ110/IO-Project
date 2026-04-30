package pl.edu.agh.project_manager.controller.project;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.milestone.MilestoneRequest;
import pl.edu.agh.project_manager.controller.dto.milestone.MilestoneResponse;
import pl.edu.agh.project_manager.controller.dto.milestone.MilestoneUpdateRequest;
import pl.edu.agh.project_manager.service.project.ProjectMilestoneService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/milestones")
@RequiredArgsConstructor
public class ProjectMilestoneController {

    private final ProjectMilestoneService milestoneService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectSecurity.canAccessProject(#projectId, authentication.principal)")
    public ResponseEntity<List<MilestoneResponse>> getMilestones(
            @PathVariable UUID projectId
    ) {
        List<MilestoneResponse> milestones = milestoneService.getProjectMilestones(projectId);
        return ResponseEntity.ok(milestones);
    }

    @PostMapping
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<MilestoneResponse> createMilestone(
            @PathVariable UUID projectId,
            @Valid @RequestBody MilestoneRequest request
    ) {
        MilestoneResponse createdMilestone = milestoneService.createMilestone(projectId, request.toCommand());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMilestone);
    }

    @PatchMapping("/{milestoneId}")
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<MilestoneResponse> updateMilestone(
            @PathVariable UUID projectId,
            @PathVariable UUID milestoneId,
            @Valid @RequestBody MilestoneUpdateRequest request
    ) {
        MilestoneResponse updatedMilestone = milestoneService.updateMilestone(projectId, milestoneId, request.toCommand());
        return ResponseEntity.ok(updatedMilestone);
    }

    @DeleteMapping("/{milestoneId}")
    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<Void> deleteMilestone(
            @PathVariable UUID projectId,
            @PathVariable UUID milestoneId
    ) {
        milestoneService.deleteMilestone(projectId, milestoneId);
        return ResponseEntity.noContent().build();
    }
}