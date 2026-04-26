package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentDetailsResponse;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectMember;
import pl.edu.agh.project_manager.domain.entity.ProjectRole;
import pl.edu.agh.project_manager.domain.entity.ProjectRoleSegmentAllocation;
import pl.edu.agh.project_manager.domain.entity.ProjectSegment;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.MembershipStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectMemberRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.ProjectRoleRepository;
import pl.edu.agh.project_manager.repository.ProjectRoleSegmentAllocationRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestCommand;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestDetailsCommand;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeAssignmentsServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectRoleRepository projectRoleRepository;
    @Mock
    private ProjectMemberRepository projectMemberRepository;
    @Mock
    private ProjectRoleSegmentAllocationRepository segmentAllocationRepository;

    @InjectMocks
    private EmployeeAssignmentsService employeeAssignmentsService;

    @Test
    void createEmployeeRequest_shouldCreateNewAssignmentWithPendingStatus() {
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
        employeeAssignmentsService.createEmployeeAssignment(command);

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
    void createEmployeeAssignment_shouldThrowException_whenRoleNotInProject() {
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
                .isThrownBy(() -> employeeAssignmentsService.createEmployeeAssignment(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.ROLE_NOT_IN_PROJECT);

        verify(projectMemberRepository, never()).save(any());
    }

    @Test
    void createEmployeeRequest_shouldThrowException_whenUserHasOngoingAssignment() {
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
                .isThrownBy(() -> employeeAssignmentsService.createEmployeeAssignment(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.USER_HAS_ONGOING_REQUEST);

        verify(projectMemberRepository, never()).save(any());
    }

    @Test
    void getEmployeeRequestDetails_shouldThrowException_whenRequestNotFound() {
        // given
        UUID requestId = UUID.randomUUID();
        EmployeeRequestDetailsCommand command = new EmployeeRequestDetailsCommand(requestId);
        given(projectMemberRepository.findById(requestId)).willReturn(Optional.empty());

        // when & then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> employeeAssignmentsService.getEmployeeRequestDetails(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND);

        verify(segmentAllocationRepository, never()).findAllUserAllocations(any());
    }

    @Test
    void getEmployeeRequestDetails_shouldHandleOverlappingSegments_whenRequestIncrementIsEmpty() {
        // given
        UUID userId = UUID.randomUUID();
        UUID requestId = UUID.randomUUID();

        User user = User.builder().id(userId).build();
        ProjectRole requestRole = ProjectRole.builder().segmentAllocations(List.of()).build();
        ProjectMember request = ProjectMember.builder()
                .id(requestId)
                .user(user)
                .role(requestRole)
                .project(Project.builder().id(UUID.randomUUID()).build())
                .membershipStatus(MembershipStatus.PENDING)
                .build();

        ProjectSegment firstSegment = ProjectSegment.builder()
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 1, 10))
                .build();
        ProjectSegment secondSegment = ProjectSegment.builder()
                .startDate(LocalDate.of(2026, 1, 5))
                .endDate(LocalDate.of(2026, 1, 15))
                .build();

        ProjectRoleSegmentAllocation firstAllocation = ProjectRoleSegmentAllocation.builder()
                .segment(firstSegment)
                .utilizationPercentage(40)
                .build();
        ProjectRoleSegmentAllocation secondAllocation = ProjectRoleSegmentAllocation.builder()
                .segment(secondSegment)
                .utilizationPercentage(30)
                .build();

        given(projectMemberRepository.findById(requestId)).willReturn(Optional.of(request));
        given(segmentAllocationRepository.findAllUserAllocations(userId))
                .willReturn(List.of(firstAllocation, secondAllocation));

        // when
        EmployeeAssignmentDetailsResponse details = employeeAssignmentsService.getEmployeeRequestDetails(new EmployeeRequestDetailsCommand(requestId));

        // then
        assertEquals(3, details.currentWorkload().size());
        assertEquals(LocalDate.of(2026, 1, 1), details.currentWorkload().get(0).startDate());
        assertEquals(LocalDate.of(2026, 1, 5), details.currentWorkload().get(0).endDate());
        assertEquals(40, details.currentWorkload().get(0).percentage());

        assertEquals(LocalDate.of(2026, 1, 5), details.currentWorkload().get(1).startDate());
        assertEquals(LocalDate.of(2026, 1, 10), details.currentWorkload().get(1).endDate());
        assertEquals(70, details.currentWorkload().get(1).percentage());

        assertEquals(LocalDate.of(2026, 1, 10), details.currentWorkload().get(2).startDate());
        assertEquals(LocalDate.of(2026, 1, 15), details.currentWorkload().get(2).endDate());
        assertEquals(30, details.currentWorkload().get(2).percentage());

        assertEquals(List.of(), details.workloadAfterApproval());
        verify(segmentAllocationRepository).findAllUserAllocations(userId);
    }
}
