package pl.edu.agh.project_manager.service.project;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.project.AssignmentResponse;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectAssignmentRepository;
import pl.edu.agh.project_manager.service.ProjectService;
import pl.edu.agh.project_manager.service.UserService;
import pl.edu.agh.project_manager.service.command.project.AssignmentCommand;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectAssignmentService {

    private final ProjectService projectService;
    private final UserService userService;
    private final ProjectAssignmentRepository assignmentRepository;

    @Transactional
    public AssignmentResponse createAssignment(UUID projectId, AssignmentCommand command) {
        Project project = projectService.getProjectEntityOrThrow(projectId);
        User user = userService.getUserEntityOrThrow(command.userId());

        validateAssignmentDates(command.startDate(), command.endDate(), project);

        ProjectAssignment assignment = ProjectAssignment.builder()
                .project(project)
                .user(user)
                .roleName(command.roleName())
                .startDate(command.startDate())
                .endDate(command.endDate())
                .utilizationPercentage(command.utilizationPercentage())
                .status(AssignmentStatus.PENDING)
                .build();

        ProjectAssignment savedAssignment = assignmentRepository.save(assignment);

        return AssignmentResponse.from(savedAssignment);
    }

    public List<AssignmentResponse> getAssignments(UUID projectId) {
        projectService.checkProjectExistsOrThrow(projectId);

        return assignmentRepository.findAllByProjectIdOrderByStartDateAsc(projectId)
                .stream()
                .map(AssignmentResponse::from)
                .toList();
    }

    @Transactional
    public void deleteAssignment(UUID projectId, UUID assignmentId) {
        ProjectAssignment assignment = getAssignmentForProject(projectId, assignmentId);

        if (assignment.getStatus() != AssignmentStatus.PENDING) {
            throw new ApplicationException(
                    ApiErrorCode.INVALID_REQUEST_STATUS,
                    "Cannot delete assignment because it is already " + assignment.getStatus()
            );
        }

        assignmentRepository.delete(assignment);
    }

    private ProjectAssignment getAssignmentForProject(UUID projectId, UUID assignmentId) {
        ProjectAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND, "Cannot find assignment: " + assignmentId));

        if (!assignment.getProject().getId().equals(projectId)) {
            throw new ApplicationException(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND, "Assignment does not belong to this project");
        }

        return assignment;
    }

    @Transactional
    public void acceptAssignment(UUID assignmentId, UUID managerId) {
        ProjectAssignment assignment = getAssignmentOrThrow(assignmentId);

        validateManagerAccess(assignment, managerId);

        validatePendingStatus(assignment);

        assignment.setStatus(AssignmentStatus.ACCEPTED);

        Project project = assignment.getProject();
        User user = assignment.getUser();

        boolean isAlreadyMember = project.getMembers().stream()
                .anyMatch(member -> member.getUser().getId().equals(user.getId()));

        if (!isAlreadyMember) {
            project.addMember(user);
        }
    }

    @Transactional
    public void rejectAssignment(UUID assignmentId, UUID managerId) {
        ProjectAssignment assignment = getAssignmentOrThrow(assignmentId);

        validateManagerAccess(assignment, managerId);
        validatePendingStatus(assignment);

        assignment.setStatus(AssignmentStatus.REJECTED);
    }

    public ProjectAssignment getAssignmentOrThrow(UUID assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND, "Cannot find assignment: " + assignmentId));
    }

    public List<ProjectAssignment> getAcceptedAssignmentsForUser(UUID userId) {
        return assignmentRepository.findAllByUserIdAndStatus(userId, AssignmentStatus.ACCEPTED);
    }

    private void validatePendingStatus(ProjectAssignment assignment) {
        if (assignment.getStatus() != AssignmentStatus.PENDING) {
            throw new ApplicationException(ApiErrorCode.INVALID_REQUEST_STATUS, "Assignment is not in PENDING state");
        }
    }

    private void validateManagerAccess(ProjectAssignment assignment, UUID managerId) {
        User employee = assignment.getUser();

        if (employee.getSupervisor() == null || !employee.getSupervisor().getId().equals(managerId)) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "You are not the linear manager of this user");
        }
    }

    private void validateAssignmentDates(LocalDate startDate, LocalDate endDate, Project project) {
        if (startDate.isAfter(endDate)) {
            throw new ApplicationException(
                    ApiErrorCode.VALIDATION_ERROR,
                    "Start date cannot be after end date"
            );
        }

        if (startDate.isBefore(project.getStartDate()) || endDate.isAfter(project.getEndDate())) {
            throw new ApplicationException(
                    ApiErrorCode.VALIDATION_ERROR,
                    "Assignment dates must fit within project start and end dates"
            );
        }
    }

    public List<AssignmentResponse> getPendingAssignmentsForManager(UUID supervisorId) {
        return assignmentRepository.findAllByUserSupervisorIdAndStatus(supervisorId, AssignmentStatus.PENDING)
                .stream()
                .map(AssignmentResponse::from)
                .toList();
    }
}