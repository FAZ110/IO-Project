package pl.edu.agh.project_manager.service.project;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.command.project.SearchProjectCommand;
import pl.edu.agh.project_manager.service.projectgroup.ProjectGroupsService;
import pl.edu.agh.project_manager.service.user.UserService;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;

import java.time.LocalDate;
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
    private UserService userService;
    @Mock
    private ProjectGroupsService projectGroupService;
    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    @Test
    @DisplayName("Should create project successfully with risks and milestones")
    void createProject_Success() {
        // Given
        UUID managerId = UUID.randomUUID();
        ProjectCreationCommand command = new ProjectCreationCommand(
                managerId,
                "Title",
                "Desc",
                LocalDate.now(),
                null,
                null,
                new ArrayList<>(List.of(new RiskCommand("Risk", "Desc", 5, 3))),
                new ArrayList<>(List.of(new MilestoneCommand("Start", "Start desc", LocalDate.now()))),
                new ArrayList<>(), // Sponsors
                new ArrayList<>()  // Committee
        );

        User manager = User.builder().id(managerId).build();
        Project savedProject = Project.builder().id(UUID.randomUUID()).build();

        when(userService.getUserEntityOrThrow(managerId)).thenReturn(manager);
        when(projectRepository.save(any(Project.class))).thenReturn(savedProject);
        when(userService.getUsersByIdsOrThrow(any(), anyString())).thenReturn(new ArrayList<>());

        // When
        UUID resultId = projectService.createProject(command);

        // Then
        assertThat(resultId).isEqualTo(savedProject.getId());
        verify(projectRepository).save(any(Project.class));
        verify(userService).getUserEntityOrThrow(managerId);
    }

    @Test
    @DisplayName("Should throw exception when project manager not found")
    void createProject_ManagerNotFound() {
        // Given
        UUID managerId = UUID.randomUUID();
        ProjectCreationCommand command = createBasicCommand(managerId);

        when(userService.getUserEntityOrThrow(managerId))
                .thenThrow(new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> projectService.createProject(command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.USER_NOT_FOUND);
    }

    @Test
    @DisplayName("Should return all projects for ADMINISTRATOR")
    void getAccessibleProjects_Administrator() {
        // Given
        UUID adminId = UUID.randomUUID();
        UserPrincipal principal = createPrincipal(adminId, UserRole.ADMINISTRATOR);
        SearchProjectCommand searchCommand = new SearchProjectCommand(principal, null, null, true, false);

        when(projectRepository.findAll(any(Specification.class))).thenReturn(List.of(
                createTestProject(UUID.randomUUID(), "Projekt A"),
                createTestProject(UUID.randomUUID(), "Projekt B")
        ));
        // When
        var result = projectService.searchProjects(searchCommand);

        // Then
        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("Should return managed projects for PROJECT_MANAGER")
    void getAccessibleProjects_ProjectManager() {
        // Given
        UUID pmId = UUID.randomUUID();
        UserPrincipal principal = createPrincipal(pmId, UserRole.PROJECT_MANAGER);
        SearchProjectCommand searchCommand = new SearchProjectCommand(principal, null, null, true, false);

        when(projectRepository.findAll(any(Specification.class))).thenReturn(List.of(
                createTestProject(UUID.randomUUID(), "Projekt A")
        ));

        // When
        var result = projectService.searchProjects(searchCommand);

        // Then
        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("Should return only projects where user is a member for COMMON role")
    void getAccessibleProjects_CommonUser() {
        // Given
        UUID userId = UUID.randomUUID();
        UserPrincipal principal = createPrincipal(userId, UserRole.COMMON);
        SearchProjectCommand searchCommand = new SearchProjectCommand(principal, null, null, true, false);

        when(projectRepository.findAll(any(Specification.class))).thenReturn(List.of(
                createTestProject(UUID.randomUUID(), "Projekt A")
        ));

        // When
        var result = projectService.searchProjects(searchCommand);

        // Then
        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("Should return project members successfully")
    void getProjectMembers_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        User sponsor = User.builder().id(UUID.randomUUID()).name("Sponsor").build();

        Project project = Project.builder()
                .id(projectId)
                .sponsors(new java.util.HashSet<>(List.of(sponsor)))
                .committees(new java.util.HashSet<>())
                .members(new java.util.HashSet<>())
                .build();

        when(projectRepository.findByIdWithAllMembers(projectId)).thenReturn(Optional.of(project));

        // When
        var response = projectService.getProjectMembers(projectId);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.sponsors()).hasSize(1);
    }

    private ProjectCreationCommand createBasicCommand(UUID managerId) {
        return new ProjectCreationCommand(
                managerId,
                "Title",
                "Desc",
                LocalDate.now(),
                null,
                null,
                new ArrayList<>(),
                new ArrayList<>(),
                new ArrayList<>(),
                new ArrayList<>()
        );
    }

    private UserPrincipal createPrincipal(UUID id, UserRole role) {
        return new UserPrincipal(
                id,
                "test@example.com",
                "secret_password",
                "Jan",
                "Kowalski",
                List.of(),
                role
        );
    }

    private Project createTestProject(UUID id, String title) {
        return Project.builder()
                .id(id)
                .title(title)
                .description("Opis")
                .startDate(LocalDate.now())
                .projectManager(User.builder().id(UUID.randomUUID()).name("Jan").build())
                .build();
    }
}