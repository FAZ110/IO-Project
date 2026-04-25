package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.vacancy.AllocationRequestResponse;
import pl.edu.agh.project_manager.controller.dto.vacancy.VacancyResponse;
import pl.edu.agh.project_manager.domain.entity.*;
import pl.edu.agh.project_manager.domain.enums.AllocationRequestStatus;
import pl.edu.agh.project_manager.domain.enums.VacancyStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.AllocationRequestRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.repository.VacancyRepository;
import pl.edu.agh.project_manager.service.command.vacancy.CreateAllocationRequestCommand;
import pl.edu.agh.project_manager.service.command.vacancy.CreateVacancyCommand;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VacancyServiceTest {

    @Mock
    private VacancyRepository vacancyRepository;
    @Mock
    private AllocationRequestRepository allocationRequestRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private VacancyService vacancyService;

    @Test
    @DisplayName("Should fetch vacancies by project ID")
    void getVacanciesByProjectId_Success() {
        UUID projectId = UUID.randomUUID();
        Project project = Project.builder().id(projectId).build();
        ProjectRole role = ProjectRole.builder().id(UUID.randomUUID()).roleName("Developer").build();

        Vacancy vacancy1 = Vacancy.builder()
                .id(UUID.randomUUID())
                .project(project)
                .projectRole(role)
                .status(VacancyStatus.OPEN)
                .build();
        Vacancy vacancy2 = Vacancy.builder()
                .id(UUID.randomUUID())
                .project(project)
                .projectRole(role)
                .status(VacancyStatus.FILLED)
                .build();

        when(vacancyRepository.findByProjectId(projectId)).thenReturn(List.of(vacancy1, vacancy2));

        List<VacancyResponse> responses = vacancyService.getVacanciesByProjectId(projectId);

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).id()).isEqualTo(vacancy1.getId());
        assertThat(responses.get(1).id()).isEqualTo(vacancy2.getId());
    }

    @Test
    @DisplayName("Should create vacancy successfully")
    void createVacancy_Success() {
        UUID projectId = UUID.randomUUID();
        UUID managerId = UUID.randomUUID();
        UUID roleId = UUID.randomUUID();
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().plusMonths(6);

        User manager = User.builder().id(managerId).build();
        ProjectRole role = ProjectRole.builder().id(roleId).roleName("Dev").build();
        Project project = Project.builder()
                .id(projectId)
                .projectManager(manager)
                .roles(new ArrayList<>(List.of(role)))
                .vacancies(new ArrayList<>())
                .build();

        CreateVacancyCommand command = new CreateVacancyCommand(projectId, roleId, startDate, endDate);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(vacancyRepository.save(any(Vacancy.class))).thenAnswer(invocation -> {
            Vacancy v = invocation.getArgument(0);
            v.setId(UUID.randomUUID());
            return v;
        });

        VacancyResponse response = vacancyService.createVacancy(command, managerId);

        assertThat(response).isNotNull();
        assertThat(response.projectId()).isEqualTo(projectId);
        assertThat(response.roleId()).isEqualTo(roleId);
        assertThat(response.status()).isEqualTo(VacancyStatus.OPEN);
        assertThat(project.getVacancies()).hasSize(1);
        verify(vacancyRepository).save(any(Vacancy.class));
    }

    @Test
    @DisplayName("Should throw exception when non-manager tries to create vacancy")
    void createVacancy_AccessDenied() {
        UUID projectId = UUID.randomUUID();
        UUID managerId = UUID.randomUUID();
        UUID intruderId = UUID.randomUUID();

        User manager = User.builder().id(managerId).build();
        Project project = Project.builder()
                .id(projectId)
                .projectManager(manager)
                .build();

        CreateVacancyCommand command = new CreateVacancyCommand(projectId, UUID.randomUUID(), LocalDate.now(), LocalDate.now());

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> vacancyService.createVacancy(command, intruderId))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.ACCESS_DENIED);
    }

    @Test
    @DisplayName("Should throw exception when role not found in project during vacancy creation")
    void createVacancy_RoleNotFound() {
        UUID projectId = UUID.randomUUID();
        UUID managerId = UUID.randomUUID();

        User manager = User.builder().id(managerId).build();
        Project project = Project.builder()
                .id(projectId)
                .projectManager(manager)
                .roles(new ArrayList<>())
                .build();

        CreateVacancyCommand command = new CreateVacancyCommand(projectId, UUID.randomUUID(), LocalDate.now(), LocalDate.now());

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> vacancyService.createVacancy(command, managerId))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.ROLE_NOT_FOUND);
    }

    @Test
    @DisplayName("Should create allocation request successfully")
    void createAllocationRequest_Success() {
        UUID vacancyId = UUID.randomUUID();
        UUID managerId = UUID.randomUUID();
        UUID requestedEmployeeId = UUID.randomUUID();

        User manager = User.builder().id(managerId).build();
        User employee = User.builder().id(requestedEmployeeId).build();

        Project project = Project.builder().projectManager(manager).build();
        Vacancy vacancy = Vacancy.builder()
                .id(vacancyId)
                .status(VacancyStatus.OPEN)
                .project(project)
                .allocationRequests(new ArrayList<>())
                .build();

        CreateAllocationRequestCommand command = new CreateAllocationRequestCommand(
                vacancyId, requestedEmployeeId, managerId, "Need a developer"
        );

        when(vacancyRepository.findById(vacancyId)).thenReturn(Optional.of(vacancy));
        when(userRepository.findById(managerId)).thenReturn(Optional.of(manager));
        when(userRepository.findById(requestedEmployeeId)).thenReturn(Optional.of(employee));
        when(allocationRequestRepository.save(any(AllocationRequest.class))).thenAnswer(invocation -> {
            AllocationRequest req = invocation.getArgument(0);
            req.setId(UUID.randomUUID());
            req.setCreatedAt(LocalDateTime.now());
            return req;
        });

        AllocationRequestResponse response = vacancyService.createAllocationRequest(command);

        assertThat(response).isNotNull();
        assertThat(response.requestedEmployeeId()).isEqualTo(requestedEmployeeId);
        assertThat(response.status()).isEqualTo(AllocationRequestStatus.SUBMITTED);
        assertThat(vacancy.getStatus()).isEqualTo(VacancyStatus.PENDING_REQUEST);
        assertThat(vacancy.getAllocationRequests()).hasSize(1);
        verify(allocationRequestRepository).save(any(AllocationRequest.class));
    }

    @Test
    @DisplayName("Should throw exception when vacancy is not OPEN")
    void createAllocationRequest_InvalidVacancyStatus() {
        UUID vacancyId = UUID.randomUUID();

        Vacancy vacancy = Vacancy.builder()
                .id(vacancyId)
                .status(VacancyStatus.FILLED)
                .build();

        CreateAllocationRequestCommand command = new CreateAllocationRequestCommand(
                vacancyId, UUID.randomUUID(), UUID.randomUUID(), "Reason"
        );

        when(vacancyRepository.findById(vacancyId)).thenReturn(Optional.of(vacancy));

        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> vacancyService.createAllocationRequest(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.INVALID_VACANCY_STATUS);
    }
    
    @Test
    @DisplayName("Should throw exception when non-manager tries to create allocation request")
    void createAllocationRequest_AccessDenied() {
        UUID vacancyId = UUID.randomUUID();
        UUID managerId = UUID.randomUUID();
        UUID intruderId = UUID.randomUUID();

        User manager = User.builder().id(managerId).build();
        User intruder = User.builder().id(intruderId).build();

        Project project = Project.builder().projectManager(manager).build();
        Vacancy vacancy = Vacancy.builder()
                .id(vacancyId)
                .status(VacancyStatus.OPEN)
                .project(project)
                .build();

        CreateAllocationRequestCommand command = new CreateAllocationRequestCommand(
                vacancyId, null, intruderId, "Reason"
        );

        when(vacancyRepository.findById(vacancyId)).thenReturn(Optional.of(vacancy));
        when(userRepository.findById(intruderId)).thenReturn(Optional.of(intruder));
        
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> vacancyService.createAllocationRequest(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.ACCESS_DENIED);
    }
}
