package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeRequestData;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeRequestDetails;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeRequestResult;
import pl.edu.agh.project_manager.service.EmployeeRequestsService;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestDetailsCommand;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employee/requests")
@AllArgsConstructor
public class EmployeeRequestsController {
    private final EmployeeRequestsService employeeRequestsService;

    @PostMapping
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Void> createEmployeeRequest(@Valid @RequestBody EmployeeRequestData request) {
        employeeRequestsService.createEmployeeRequest(EmployeeRequestData.toCommand(request));

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<List<EmployeeRequestResult>> getEmployeeRequests() {
        List<EmployeeRequestResult> requests = employeeRequestsService.getEmployeeRequests();

        return ResponseEntity.ok(requests);
    }

    @GetMapping("{requestId}")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<EmployeeRequestDetails> getEmployeeRequestDetails(@PathVariable UUID requestId) {
        EmployeeRequestDetails details = employeeRequestsService.getEmployeeRequestDetails(new EmployeeRequestDetailsCommand(requestId));

        return ResponseEntity.ok(details);
    }


    @GetMapping("{requestId}/accept")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<Void> acceptEmployeeRequest(@PathVariable UUID requestId) {
        employeeRequestsService.acceptEmployeeRequest(requestId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("{requestId}/reject")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<Void> rejectEmployeeRequest(@PathVariable UUID requestId) {
        employeeRequestsService.rejectEmployeeRequest(requestId);

        return ResponseEntity.noContent().build();
    }
}
