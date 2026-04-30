package pl.edu.agh.project_manager.service.project;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.project.RiskResponse;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectRisk;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.RiskRepository;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProjectRiskServiceTest {

    @Mock
    private RiskRepository riskRepository;
    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectRiskService riskService;

    @Test
    @DisplayName("Should delete risk when it belongs to the project")
    void deleteProjectRisk_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID riskId = UUID.randomUUID();

        Project project = Project.builder().id(projectId).build();
        ProjectRisk risk = ProjectRisk.builder().id(riskId).project(project).build();

        when(riskRepository.findById(riskId)).thenReturn(Optional.of(risk));

        // When
        riskService.deleteProjectRisk(projectId, riskId);

        // Then
        verify(riskRepository).delete(risk);
    }

    @Test
    @DisplayName("Should update risk fields correctly")
    void updateProjectRisk_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID riskId = UUID.randomUUID();
        RiskCommand command = new RiskCommand("New Name", "New Desc", 90);

        Project project = Project.builder().id(projectId).build();
        ProjectRisk risk = ProjectRisk.builder()
                .id(riskId)
                .name("Old")
                .project(project)
                .build();

        when(riskRepository.findById(riskId)).thenReturn(Optional.of(risk));

        // When
        RiskResponse response = riskService.updateProjectRisk(projectId, riskId, command);

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
        RiskCommand command = new RiskCommand("Title", "Desc", 50);

        Project project = Project.builder().id(projectId).build();
        ProjectRisk savedRisk = ProjectRisk.builder()
                .id(UUID.randomUUID())
                .name("Title")
                .project(project)
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(riskRepository.save(any(ProjectRisk.class))).thenReturn(savedRisk);

        // When
        RiskResponse response = riskService.createProjectRisk(command, projectId);

        // Then
        assertThat(response.id()).isEqualTo(savedRisk.getId());
        verify(riskRepository).save(any(ProjectRisk.class));
    }
}