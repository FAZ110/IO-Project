package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.allocationrequest.AllocationRequestResponse;
import pl.edu.agh.project_manager.controller.dto.project.ProjectRoleStatusResponse;
import pl.edu.agh.project_manager.domain.entity.*;
import pl.edu.agh.project_manager.domain.enums.AllocationRequestStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.AllocationRequestRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.ProjectRoleRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.allocationrequest.CreateAllocationRequestCommand;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectRoleServiceTest {

    @Mock
    private ProjectRoleRepository projectRoleRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private AllocationRequestRepository allocationRequestRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectRoleService projectRoleService;

    private UUID projectId;
    private Project project;
    private ProjectRole role;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        project = new Project();
        project.setId(projectId);
        
        role = ProjectRole.builder()
                .id(UUID.randomUUID())
                .roleName("Developer")
                .project(project)
                .members(new ArrayList<>())
                .allocationRequests(new ArrayList<>())
                .build();
                
        project.setRoles(List.of(role));
    }

    @Test
    void getProjectRolesStatus_ShouldReturnRolesWithStatus() {
        // Given
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        // When
        List<ProjectRoleStatusResponse> responses = projectRoleService.getProjectRolesStatus(projectId);

        // Then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).roleName()).isEqualTo("Developer");
        assertThat(responses.get(0).status()).isEqualTo("OPEN");
    }

    @Test
    void createAllocationRequest_ShouldCreateRequest_WhenValid() {
        // Given
        UUID employeeId = UUID.randomUUID();
        UUID creatorId = UUID.randomUUID();
        User employee = new User(); employee.setId(employeeId);
        User creator = new User(); creator.setId(creatorId);

        CreateAllocationRequestCommand command = new CreateAllocationRequestCommand(
                role.getId(), employeeId, creatorId, "Need more dev power"
        );

        when(projectRoleRepository.findById(role.getId())).thenReturn(Optional.of(role));
        when(userRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(userRepository.findById(creatorId)).thenReturn(Optional.of(creator));
        
        AllocationRequest savedRequest = AllocationRequest.builder()
                .id(UUID.randomUUID())
                .projectRole(role)
                .requestedEmployee(employee)
                .createdBy(creator)
                .justification(command.justification())
                .status(AllocationRequestStatus.SUBMITTED)
                .build();
        
        when(allocationRequestRepository.save(any(AllocationRequest.class))).thenReturn(savedRequest);

        // When
        AllocationRequestResponse response = projectRoleService.createAllocationRequest(command);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.status()).isEqualTo(AllocationRequestStatus.SUBMITTED);
        assertThat(response.justification()).isEqualTo("Need more dev power");
        verify(allocationRequestRepository).save(any(AllocationRequest.class));
    }

    @Test
    void createAllocationRequest_ShouldThrowException_WhenRoleAlreadyFilled() {
        // Given
        role.setMembers(List.of(new ProjectMember()));
        CreateAllocationRequestCommand command = new CreateAllocationRequestCommand(
                role.getId(), UUID.randomUUID(), UUID.randomUUID(), "Justification"
        );

        when(projectRoleRepository.findById(role.getId())).thenReturn(Optional.of(role));
        when(userRepository.findById(any())).thenReturn(Optional.of(new User()));

        // When & Then
        assertThatThrownBy(() -> projectRoleService.createAllocationRequest(command))
                .isInstanceOf(ApplicationException.class)
                .hasFieldOrPropertyWithValue("errorCode", ApiErrorCode.INVALID_REQUEST_STATUS);
    }

    @Test
    void createAllocationRequest_ShouldThrowException_WhenPendingRequestExists() {
        // Given
        AllocationRequest pendingRequest = new AllocationRequest();
        pendingRequest.setStatus(AllocationRequestStatus.SUBMITTED);
        role.setAllocationRequests(List.of(pendingRequest));

        CreateAllocationRequestCommand command = new CreateAllocationRequestCommand(
                role.getId(), UUID.randomUUID(), UUID.randomUUID(), "Justification"
        );

        when(projectRoleRepository.findById(role.getId())).thenReturn(Optional.of(role));
        when(userRepository.findById(any())).thenReturn(Optional.of(new User()));

        // When & Then
        assertThatThrownBy(() -> projectRoleService.createAllocationRequest(command))
                .isInstanceOf(ApplicationException.class)
                .hasFieldOrPropertyWithValue("errorCode", ApiErrorCode.INVALID_REQUEST_STATUS);
    }
}
