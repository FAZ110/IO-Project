package pl.edu.agh.project_manager.service.approval;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.project.ProjectAssignmentUserWorkloadResponse;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.service.project.ProjectAssignmentService;
import pl.edu.agh.project_manager.util.assignments.AssignmentsUtil;


import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class AssignmentManagementService {

    private final ProjectAssignmentService projectAssignmentService;

    @Transactional(readOnly = true)
    public EmployeeAssignmentDetailsResponse getEmployeeRequestDetails(UUID assignmentId) {
        ProjectAssignment requestedAssignment = projectAssignmentService.getAssignmentOrThrow(assignmentId);

        UUID userId = requestedAssignment.getUser().getId();

        List<ProjectAssignment> currentAssignments = projectAssignmentService.getAcceptedAssignmentsForUser(userId);

        return new EmployeeAssignmentDetailsResponse(
                AssignmentsUtil.generateWorkloadSteps(currentAssignments),
                AssignmentsUtil.generateWorkloadSteps(List.of(requestedAssignment))
        );
    }

    @Transactional(readOnly = true)
    public ProjectAssignmentUserWorkloadResponse getUserWorkload(UUID userId) {
        List<ProjectAssignment> currentAssignments = projectAssignmentService.getAcceptedAssignmentsForUser(userId);
        return new ProjectAssignmentUserWorkloadResponse(
                AssignmentsUtil.generateWorkloadSteps(currentAssignments)
        );
    }
}
