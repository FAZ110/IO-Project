package pl.edu.agh.project_manager.service.project;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.milestone.MilestoneResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMilestone;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.repository.project.ProjectMilestoneRepository;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectMilestoneServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMilestoneRepository milestoneRepository;

    @InjectMocks
    private ProjectMilestoneService milestoneService;

    @Test
    @DisplayName("Should create milestone successfully")
    void createMilestone_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        MilestoneCommand command = new MilestoneCommand("UAT", "User Acceptance Tests", LocalDate.of(2026, 10, 10));

        Project project = Project.builder()
                .id(projectId)
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .build();

        ProjectMilestone savedMilestone = ProjectMilestone.builder()
                .id(UUID.randomUUID())
                .name(command.name())
                .date(command.date())
                .project(project)
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(milestoneRepository.save(any(ProjectMilestone.class))).thenReturn(savedMilestone);

        // When
        MilestoneResponse response = milestoneService.createMilestone(projectId, command);

        // Then
        assertThat(response.name()).isEqualTo("UAT");
        verify(milestoneRepository).save(any(ProjectMilestone.class));
    }

    @Test
    @DisplayName("Should throw exception when milestone date is outside project range")
    void createMilestone_InvalidDate() {
        // Given
        UUID projectId = UUID.randomUUID();
        MilestoneCommand command = new MilestoneCommand("Late Task", "Desc", LocalDate.of(2027, 1, 1));

        Project project = Project.builder()
                .id(projectId)
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> milestoneService.createMilestone(projectId, command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.INVALID_MILESTONE_DATE);

        verify(milestoneRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should update milestone successfully")
    void updateMilestone_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID milestoneId = UUID.randomUUID();
        MilestoneCommand command = new MilestoneCommand("New Name", "New Desc", LocalDate.of(2026, 11, 11));

        Project project = Project.builder()
                .id(projectId)
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .build();

        ProjectMilestone existingMilestone = ProjectMilestone.builder()
                .id(milestoneId)
                .project(project)
                .name("Old Name")
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(milestoneRepository.findById(milestoneId)).thenReturn(Optional.of(existingMilestone));

        // When
        MilestoneResponse response = milestoneService.updateMilestone(projectId, milestoneId, command);

        // Then
        assertThat(response.name()).isEqualTo("New Name");
        assertThat(existingMilestone.getDescription()).isEqualTo("New Desc");
        assertThat(existingMilestone.getDate()).isEqualTo(LocalDate.of(2026, 11, 11));
    }

    @Test
    @DisplayName("Should throw exception when milestone does not belong to project")
    void getMilestoneForProject_WrongProject() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID otherProjectId = UUID.randomUUID();
        UUID milestoneId = UUID.randomUUID();

        Project otherProject = Project.builder().id(otherProjectId).build();
        ProjectMilestone milestone = ProjectMilestone.builder()
                .id(milestoneId)
                .project(otherProject)
                .build();

        when(milestoneRepository.findById(milestoneId)).thenReturn(Optional.of(milestone));

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> milestoneService.deleteMilestone(projectId, milestoneId))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.MILESTONE_NOT_FOUND);
    }

    @Test
    @DisplayName("Should delete milestone successfully")
    void deleteMilestone_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID milestoneId = UUID.randomUUID();

        Project project = Project.builder().id(projectId).build();
        ProjectMilestone milestone = ProjectMilestone.builder()
                .id(milestoneId)
                .project(project)
                .build();

        when(milestoneRepository.findById(milestoneId)).thenReturn(Optional.of(milestone));

        // When
        milestoneService.deleteMilestone(projectId, milestoneId);

        // Then
        verify(milestoneRepository).delete(milestone);
    }
}