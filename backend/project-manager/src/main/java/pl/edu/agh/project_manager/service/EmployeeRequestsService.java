package pl.edu.agh.project_manager.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeRequestResult;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeRequestStatus;
import pl.edu.agh.project_manager.domain.entity.*;
import pl.edu.agh.project_manager.domain.enums.MembershipStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectMemberRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.ProjectRoleRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestCommand;

import java.util.List;

@Service
@AllArgsConstructor
public class EmployeeRequestsService {
    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final ProjectRoleRepository projectRoleRepository;

    private final ProjectMemberRepository projectMemberRepository;

    @Transactional
    public void createEmployeeRequest(EmployeeRequestCommand command) {
        User employee = userRepository.findById(command.userId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        Project project = projectRepository.findById(command.projectId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND));

        ProjectRole role = projectRoleRepository.findById(command.roleId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_ROLE_NOT_FOUND));

        if (!role.getProject().getId().equals(command.projectId())) {
            throw new ApplicationException(ApiErrorCode.ROLE_NOT_IN_PROJECT);
        }

        if (projectMemberRepository.existsByUserIdAndProjectIdAndMembershipStatus(command.userId(), command.projectId(), MembershipStatus.PENDING)) {
            throw new ApplicationException(ApiErrorCode.USER_HAS_ONGOING_REQUEST);
        }

        if (projectMemberRepository.existsByUserIdAndProjectIdAndMembershipStatus(command.userId(), command.projectId(), MembershipStatus.ACCEPTED)) {
            throw new ApplicationException(ApiErrorCode.USER_ALREADY_IN_PROJECT);
        }

        ProjectMember member = ProjectMember
                .builder()
                .membershipStatus(MembershipStatus.PENDING)
                .user(employee)
                .project(project)
                .role(role)
                .build();

        projectMemberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public List<EmployeeRequestResult> getEmployeeRequests() {
        return projectMemberRepository.findAllWithDetails().stream()
                .map(member -> {
                    var project = member.getProject();
                    var user = member.getUser();
                    var requestStatus = switch (member.getMembershipStatus()) {
                        case PENDING -> EmployeeRequestStatus.PENDING;
                        case ACCEPTED -> EmployeeRequestStatus.ACCEPTED;
                        case REJECTED -> EmployeeRequestStatus.REJECTED;
                    };

                    return new EmployeeRequestResult(
                            project.getTitle(),
                            project.getId().toString(),
                            member.getRole().getRoleName(),
                            user.getName(),
                            user.getSurname(),
                            requestStatus,
                            member.getCreatedAt()
                    );
                })
                .toList();
    }
}
