package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectRepository;
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
                new ArrayList<>(List.of(new RiskCommand("Risk", "Desc", 50))),
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
        verify(projectRepository).findByIdWithAllMembers(projectId);
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
}