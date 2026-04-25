package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Test;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectMember;
import pl.edu.agh.project_manager.domain.entity.ProjectRole;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.MembershipStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectMemberRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.ProjectRoleRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestCommand;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeRequestsServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectRoleRepository projectRoleRepository;
    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @InjectMocks
    private EmployeeRequestsService employeeRequestsService;

    @Test
    void createEmployeeRequest_shouldCreateNewRequestWithPendingStatus() {
        // given
        UUID userId = UUID.randomUUID();
        UUID projectId = UUID.randomUUID();
        UUID roleId = UUID.randomUUID();
        EmployeeRequestCommand command = new EmployeeRequestCommand(userId, projectId, roleId);

        User user = new User();
        Project project = Project.builder().id(projectId).build();
        ProjectRole role = ProjectRole.builder()
                .project(project)
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(projectRepository.findById(projectId)).willReturn(Optional.of(project));
        given(projectRoleRepository.findById(roleId)).willReturn(Optional.of(role));

        // no duplicates
        given(projectMemberRepository.existsByUserIdAndProjectIdAndMembershipStatus(any(), any(), eq(MembershipStatus.PENDING)))
                .willReturn(false);
        given(projectMemberRepository.existsByUserIdAndProjectIdAndMembershipStatus(any(), any(), eq(MembershipStatus.ACCEPTED)))
                .willReturn(false);

        // when
        employeeRequestsService.createEmployeeRequest(command);

        // then
        ArgumentCaptor<ProjectMember> memberCaptor = ArgumentCaptor.forClass(ProjectMember.class);
        verify(projectMemberRepository).save(memberCaptor.capture());

        ProjectMember savedMember = memberCaptor.getValue();
        assertEquals(MembershipStatus.PENDING, savedMember.getMembershipStatus());
        assertEquals(user, savedMember.getUser());
        assertEquals(project, savedMember.getProject());
        assertEquals(role, savedMember.getRole());
    }

    @Test
    void createEmployeeRequest_shouldThrowException_whenRoleNotInProject() {
        // given
        UUID projectId = UUID.randomUUID();
        UUID otherProjectId = UUID.randomUUID();
        EmployeeRequestCommand command = new EmployeeRequestCommand(UUID.randomUUID(), projectId, UUID.randomUUID());

        Project project = Project.builder().id(projectId).build();
        Project otherProject = Project.builder().id(otherProjectId).build();
        ProjectRole role = ProjectRole.builder().project(otherProject).build();

        given(userRepository.findById(any())).willReturn(Optional.of(new User()));
        given(projectRepository.findById(projectId)).willReturn(Optional.of(project));
        given(projectRoleRepository.findById(any())).willReturn(Optional.of(role));

        // when & then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> employeeRequestsService.createEmployeeRequest(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.ROLE_NOT_IN_PROJECT);

        verify(projectMemberRepository, never()).save(any());
    }

    @Test
    void createEmployeeRequest_shouldThrowException_whenUserHasOngoingRequest() {
        // given
        UUID userId = UUID.randomUUID();
        UUID projectId = UUID.randomUUID();
        EmployeeRequestCommand command = new EmployeeRequestCommand(userId, projectId, UUID.randomUUID());

        Project project = Project.builder().id(projectId).build();
        ProjectRole role = ProjectRole.builder().project(project).build();

        given(userRepository.findById(any())).willReturn(Optional.of(new User()));
        given(projectRepository.findById(any())).willReturn(Optional.of(project));
        given(projectRoleRepository.findById(any())).willReturn(Optional.of(role));

        given(projectMemberRepository.existsByUserIdAndProjectIdAndMembershipStatus(any(), any(), eq(MembershipStatus.PENDING)))
                .willReturn(true);

        // when & then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> employeeRequestsService.createEmployeeRequest(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.USER_HAS_ONGOING_REQUEST);

        verify(projectMemberRepository, never()).save(any());
    }
}
