package pl.edu.agh.project_manager.controller.approval;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.approvals.QualificationDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.approvals.QualificationRequestResponse;
import pl.edu.agh.project_manager.controller.dto.approvals.QualificationUpdateRequest;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.project.AssignmentResponse;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.approval.AssignmentManagementService;
import pl.edu.agh.project_manager.service.approval.QualificationManagementService;
import pl.edu.agh.project_manager.service.project.ProjectAssignmentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalsController {

    private final ProjectAssignmentService assignmentService;
    private final AssignmentManagementService assignmentManagementService;
    private final QualificationManagementService qualificationService;

    @GetMapping("/assignments/pending")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<List<AssignmentResponse>> getPendingAssignments(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<AssignmentResponse> pending = assignmentService.getPendingAssignmentsForManager(principal.userId());
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/assignments/{assignmentId}/accept")
    @PreAuthorize("hasRole('LINEAR_MANAGER') and @assignmentAccess.canManageAssignment(#assignmentId, authentication.principal)")
    public ResponseEntity<Void> acceptAssignment(
            @PathVariable UUID assignmentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        assignmentService.acceptAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assignments/{assignmentId}/reject")
    @PreAuthorize("hasRole('LINEAR_MANAGER') and @assignmentAccess.canManageAssignment(#assignmentId, authentication.principal)")
    public ResponseEntity<Void> rejectAssignment(
            @PathVariable UUID assignmentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        assignmentService.rejectAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assignments/{assignmentId}/details")
    @PreAuthorize("hasRole('LINEAR_MANAGER') and @assignmentAccess.canManageAssignment(#assignmentId, authentication.principal)")
    public ResponseEntity<EmployeeAssignmentDetailsResponse> getAssignmentDetails(
            @PathVariable UUID assignmentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        EmployeeAssignmentDetailsResponse details = assignmentManagementService.getEmployeeRequestDetails(assignmentId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/qualifications")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<List<QualificationRequestResponse>> getUsersWithWaitingQualifications(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(qualificationService.getRecordsForManager(principal.userId()));
    }

    @GetMapping("/qualifications/details")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<List<QualificationDetailsResponse>> getQualificationRequestDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam UUID userId
    ) {
        return ResponseEntity.ok(qualificationService.getPendingForUser(principal.userId(), userId));
    }

    @PostMapping("/qualifications/bulk-update")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<Void> updateQualificationRequests(
            @Valid @RequestBody List<QualificationUpdateRequest> requests,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        qualificationService.updateRequests(principal.userId(), requests);
        return ResponseEntity.noContent().build();
    }
}