package pl.edu.agh.project_manager.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeRequestData;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeRequestResult;
import pl.edu.agh.project_manager.service.EmployeeRequestsService;

import java.util.List;

@RestController
@RequestMapping("/api/employee/requests")
@AllArgsConstructor
public class EmployeeRequestsController {
    private final EmployeeRequestsService employeeRequestsService;

    @PostMapping
    public ResponseEntity<Void> createEmployeeRequest(EmployeeRequestData request) {
        employeeRequestsService.createEmployeeRequest(EmployeeRequestData.toCommand(request));

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<EmployeeRequestResult>> getEmployeeRequests() {
        List<EmployeeRequestResult> requests = employeeRequestsService.getEmployeeRequests();

        return ResponseEntity.ok(requests);
    }
}
