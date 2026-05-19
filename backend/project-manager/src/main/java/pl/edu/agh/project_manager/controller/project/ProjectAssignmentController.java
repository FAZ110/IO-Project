package pl.edu.agh.project_manager.controller.project;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project.AssignmentCreateRequest;
import pl.edu.agh.project_manager.controller.dto.project.AssignmentResponse;
import pl.edu.agh.project_manager.controller.dto.project.AssignmentsByEmployeeResponse;
import pl.edu.agh.project_manager.service.project.ProjectAssignmentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/assignments")
@RequiredArgsConstructor
public class ProjectAssignmentController {

    private final ProjectAssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("@projectAccess.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<AssignmentResponse> createAssignment(
            @PathVariable UUID projectId,
            @Valid @RequestBody AssignmentCreateRequest request
    ) {
        AssignmentResponse response = assignmentService.createAssignment(projectId, request.toCommand());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'AUTHORITY') or @projectAccess.canAccessProject(#projectId, authentication.principal)")
    public ResponseEntity<List<AssignmentsByEmployeeResponse>> getAssignments(
            @PathVariable UUID projectId
    ) {
        List<AssignmentsByEmployeeResponse> response = assignmentService.getProjectAssignments(projectId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{assignmentId}")
    @PreAuthorize("@projectAccess.isProjectManagerForProject(#projectId, authentication.principal)")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable UUID projectId,
            @PathVariable UUID assignmentId
    ) {
        assignmentService.deleteAssignment(projectId, assignmentId);
        return ResponseEntity.noContent().build();
    }
}