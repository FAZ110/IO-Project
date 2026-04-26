package pl.edu.agh.project_manager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.allocationrequest.AllocationRequestResponse;
import pl.edu.agh.project_manager.controller.dto.project.ProjectRoleStatusResponse;
import pl.edu.agh.project_manager.domain.entity.AllocationRequest;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectRole;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.AllocationRequestStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.AllocationRequestRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.ProjectRoleRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.allocationrequest.CreateAllocationRequestCommand;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectRoleService {
    private final ProjectRoleRepository projectRoleRepository;
    private final ProjectRepository projectRepository;
    private final AllocationRequestRepository allocationRequestRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ProjectRoleStatusResponse> getProjectRolesStatus(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND));
        
        return project.getRoles().stream()
                .map(ProjectRoleStatusResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public AllocationRequestResponse createAllocationRequest(CreateAllocationRequestCommand command) {
        ProjectRole role = projectRoleRepository.findById(command.projectRoleId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_ROLE_NOT_FOUND, "Role not found"));

        User requestedEmployee = userRepository.findById(command.requestedEmployeeId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Employee not found"));

        User createdBy = userRepository.findById(command.createdById())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Creator not found"));

        // Check if role is already filled
        if (role.getMembers() != null && !role.getMembers().isEmpty()) {
            throw new ApplicationException(ApiErrorCode.INVALID_REQUEST_STATUS, "Role is already filled");
        }

        // Check if there is already a pending request for this role
        boolean hasPending = role.getAllocationRequests().stream()
                .anyMatch(req -> req.getStatus() == AllocationRequestStatus.SUBMITTED);
        
        if (hasPending) {
            throw new ApplicationException(ApiErrorCode.INVALID_REQUEST_STATUS, "Allocation request already exists for this role");
        }

        AllocationRequest request = AllocationRequest.builder()
                .projectRole(role)
                .requestedEmployee(requestedEmployee)
                .createdBy(createdBy)
                .justification(command.justification())
                .status(AllocationRequestStatus.SUBMITTED)
                .build();

        AllocationRequest savedRequest = allocationRequestRepository.save(request);
        return AllocationRequestResponse.from(savedRequest);
    }
}
