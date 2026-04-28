package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.project.RiskResponse;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectMember;
import pl.edu.agh.project_manager.domain.entity.ProjectRisk;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectGroupsRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.RiskRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;
import pl.edu.agh.project_manager.service.command.project.RoleCommand;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private RiskRepository riskRepository;
    @Mock
    private ProjectGroupsRepository projectGroupsRepository;

    @InjectMocks
    private ProjectService projectService;


    @Test
    @DisplayName("Should create project successfully")
    void createProject_Success() {
        // Given
        UUID managerId = UUID.randomUUID();
        List<MilestoneCommand> milestones = List.of(
                new MilestoneCommand("start", LocalDate.now()),
                new MilestoneCommand("end", LocalDate.now().plusMonths(3))
        );

        ProjectCreationCommand command = new ProjectCreationCommand(
                managerId,
                "Title",
                "Desc",
                LocalDate.now(),
                null,
                new ArrayList<>(),
                new ArrayList<>(),
                milestones,
                new ArrayList<>(),
                new ArrayList<>()
        );
        User manager = User.builder().id(managerId).projects(new ArrayList<>()).build();
        Project savedProject = Project.builder().id(UUID.randomUUID()).build();

        when(userRepository.findById(managerId)).thenReturn(Optional.of(manager));
        when(projectRepository.save(any(Project.class))).thenReturn(savedProject);

        // When
        UUID resultId = projectService.createProject(command);

        // Then
        assertThat(resultId).isEqualTo(savedProject.getId());
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    @DisplayName("Should throw exception when milestones are not in chronological order")
    void createProject_InvalidMilestoneOrder() {
        // Given
        UUID creatorId = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();
        List<MilestoneCommand> milestones = List.of(
                new MilestoneCommand("start", LocalDate.now()),
                new MilestoneCommand("end", LocalDate.now().minusDays(5))
        );

        ProjectCreationCommand command = new ProjectCreationCommand(
                creatorId, "Title", "Desc", LocalDate.now(), null,
                new ArrayList<>(), new ArrayList<>(), milestones, new ArrayList<>(), new ArrayList<>()
        );

        when(userRepository.findById(creatorId)).thenReturn(Optional.of(User.builder().id(creatorId).build()));

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> projectService.createProject(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.INVALID_MILESTONE_ORDER);
    }

    @Test
    @DisplayName("Should throw exception when role utilization count does not match segments count")
    void createProject_InvalidRoleUtilization() {
        // Given
        UUID creatorId = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();
        List<MilestoneCommand> milestones = List.of(
                new MilestoneCommand("start", LocalDate.now()),
                new MilestoneCommand("mid", LocalDate.now().plusDays(10)),
                new MilestoneCommand("end", LocalDate.now().plusDays(20))
        );
        RoleCommand invalidRole = new RoleCommand("Developer", List.of(100));

        ProjectCreationCommand command = new ProjectCreationCommand(
                creatorId, "Title", "Desc", LocalDate.now(), null,
                new ArrayList<>(), List.of(invalidRole), milestones, new ArrayList<>(), new ArrayList<>()
        );

        when(userRepository.findById(creatorId)).thenReturn(Optional.of(User.builder().id(creatorId).build()));

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> projectService.createProject(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.INVALID_ROLE_UTILIZATION);
    }

    @Test
    @DisplayName("Should throw exception when not enough milestones")
    void createProject_NotEnoughMilestones() {
        // Given
        UUID creatorId = UUID.randomUUID();
        List<MilestoneCommand> milestones = List.of(
                new MilestoneCommand("start", LocalDate.now())
        );

        ProjectCreationCommand command = new ProjectCreationCommand(
                creatorId, "Title", "Desc", LocalDate.now(), null,
                new ArrayList<>(), new ArrayList<>(), milestones, new ArrayList<>(), new ArrayList<>()
        );

        User manager = User.builder().id(creatorId).build();
        when(userRepository.findById(creatorId)).thenReturn(Optional.of(manager));

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> projectService.createProject(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.INVALID_MILESTONES);
    }

    @Test
    @DisplayName("Should return project members successfully")
    void getProjectMembers_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        User sponsor = User.builder().id(UUID.randomUUID()).name("Sponsor").build();
        User committee = User.builder().id(UUID.randomUUID()).name("Committee").build();
        User employeeUser = User.builder().id(UUID.randomUUID()).name("Employee").build();

        ProjectMember employeeMember = ProjectMember.builder()
                .user(employeeUser)
                .membershipStatus(pl.edu.agh.project_manager.domain.enums.MembershipStatus.ACCEPTED)
                .build();

        Project project = Project.builder()
                .id(projectId)
                .sponsors(new java.util.HashSet<>(List.of(sponsor)))
                .committees(new java.util.HashSet<>(List.of(committee)))
                .members(new java.util.HashSet<>(List.of(employeeMember)))
                .build();

        when(projectRepository.findByIdWithAllMembers(projectId)).thenReturn(Optional.of(project));

        // When
        pl.edu.agh.project_manager.controller.dto.project.ProjectMembersResponse response =
                projectService.getProjectMembers(projectId);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.sponsors()).hasSize(1);
        assertThat(response.sponsors().get(0).id()).isEqualTo(sponsor.getId());

        assertThat(response.committees()).hasSize(1);
        assertThat(response.committees().get(0).id()).isEqualTo(committee.getId());

        assertThat(response.employees()).hasSize(1);
        assertThat(response.employees().get(0).id()).isEqualTo(employeeUser.getId());

        verify(projectRepository).findByIdWithAllMembers(projectId);
    }

    @Test
    @DisplayName("Should throw exception when getting members for non-existent project")
    void getProjectMembers_ProjectNotFound() {
        // Given
        UUID projectId = UUID.randomUUID();
        when(projectRepository.findByIdWithAllMembers(projectId)).thenReturn(Optional.empty());

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> projectService.getProjectMembers(projectId))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.PROJECT_NOT_FOUND);

        verify(projectRepository).findByIdWithAllMembers(projectId);
    }

    @Test
    @DisplayName("Should return list of project risks")
    void getProjectRisks_Success() {
        // Given
        UUID projectId = UUID.randomUUID();

        ProjectRisk risk1 = ProjectRisk.builder()
                .id(UUID.randomUUID())
                .name("Risk 1")
                .description("Description 1")
                .probability(30)
                .build();

        ProjectRisk risk2 = ProjectRisk.builder()
                .id(UUID.randomUUID())
                .name("Risk 2")
                .description("Description 2")
                .probability(80)
                .build();

        when(riskRepository.findAllByProjectId(projectId)).thenReturn(List.of(risk1, risk2));

        // When
        List<RiskResponse> responses = projectService.getProjectRisks(projectId);

        // Then
        assertThat(responses).hasSize(2);
        assertThat(responses).extracting(RiskResponse::name)
                .containsExactlyInAnyOrder("Risk 1", "Risk 2");
        assertThat(responses).extracting(RiskResponse::probability)
                .containsExactlyInAnyOrder(30, 80);

        verify(riskRepository).findAllByProjectId(projectId);
    }


    @Test
    @DisplayName("Should delete risk when user is project manager")
    void deleteProjectRisk_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID riskId = UUID.randomUUID();
        UUID managerId = UUID.randomUUID();

        User manager = User.builder().id(managerId).build();
        ProjectRisk risk = ProjectRisk.builder().id(riskId).build();
        Project project = Project.builder()
                .id(projectId)
                .projectManager(manager)
                .risks(new ArrayList<>(java.util.List.of(risk)))
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        // When
        projectService.deleteProjectRisk(projectId, riskId);

        // Then
        assertThat(project.getRisks()).isEmpty();
    }

    @Test
    @DisplayName("Should update risk fields correctly")
    void updateProjectRisk_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID riskId = UUID.randomUUID();
        UUID managerId = UUID.randomUUID();
        RiskCommand command = new RiskCommand("New Name", "New Desc", 90);

        User manager = User.builder().id(managerId).build();
        ProjectRisk risk = ProjectRisk.builder().id(riskId).name("Old").build();
        Project project = Project.builder()
                .id(projectId)
                .projectManager(manager)
                .risks(new ArrayList<>(java.util.List.of(risk)))
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        // When
        RiskResponse response = projectService.updateProjectRisk(projectId, riskId, command);

        // Then
        assertThat(response.name()).isEqualTo("New Name");
        assertThat(risk.getName()).isEqualTo("New Name");
        assertThat(risk.getProbability()).isEqualTo(90);
    }


    @Test
    @DisplayName("Should add new risk to existing project")
    void createProjectRisk_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID managerId = UUID.randomUUID();
        RiskCommand command = new RiskCommand("Title", "Desc", 50);

        User manager = User.builder().id(managerId).build();
        Project project = Project.builder().id(projectId).projectManager(manager).risks(new ArrayList<>()).build();
        ProjectRisk savedRisk = ProjectRisk.builder().id(UUID.randomUUID()).name("Title").build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(riskRepository.save(any(ProjectRisk.class))).thenReturn(savedRisk);

        // When
        RiskResponse response = projectService.createProjectRisk(command, projectId);

        // Then
        assertThat(response.id()).isEqualTo(savedRisk.getId());
        verify(riskRepository).save(any(ProjectRisk.class));
        assertThat(project.getRisks()).hasSize(1);
    }
}