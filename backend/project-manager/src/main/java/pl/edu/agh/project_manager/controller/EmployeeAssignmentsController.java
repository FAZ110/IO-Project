package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentRequest;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentResponse;
import pl.edu.agh.project_manager.service.EmployeeAssignmentsService;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestDetailsCommand;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employee/requests")
@AllArgsConstructor
public class EmployeeAssignmentsController {
    private final EmployeeAssignmentsService employeeAssignmentsService;

    @PostMapping
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Void> createEmployeeAssignment(@Valid @RequestBody EmployeeAssignmentRequest request) {
        employeeAssignmentsService.createEmployeeAssignment(EmployeeAssignmentRequest.toCommand(request));

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<List<EmployeeAssignmentResponse>> getEmployeeAssignments() {
        List<EmployeeAssignmentResponse> requests = employeeAssignmentsService.getEmployeeAssignments();

        return ResponseEntity.ok(requests);
    }

    @GetMapping("{requestId}")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<EmployeeAssignmentDetailsResponse> getEmployeeRequestDetails(@PathVariable UUID requestId) {
        EmployeeAssignmentDetailsResponse details = employeeAssignmentsService.getEmployeeRequestDetails(new EmployeeRequestDetailsCommand(requestId));

        return ResponseEntity.ok(details);
    }


    @PostMapping("{requestId}/accept")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<Void> acceptEmployeeAssignment(@PathVariable UUID requestId) {
        employeeAssignmentsService.acceptEmployeeAssignment(requestId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("{requestId}/reject")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<Void> rejectEmployeeAssignment(@PathVariable UUID requestId) {
        employeeAssignmentsService.rejectEmployeeAssignment(requestId);

        return ResponseEntity.noContent().build();
    }
}
