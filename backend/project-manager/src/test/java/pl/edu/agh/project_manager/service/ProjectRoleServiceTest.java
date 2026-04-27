package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.project.ProjectRoleStatusResponse;
import pl.edu.agh.project_manager.domain.entity.*;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectRepository;

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
    private ProjectRepository projectRepository;

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
                .build();
                
        project.setRoles(List.of(role));
    }

    @Test
    void getProjectRolesStatus_ShouldReturnRolesWithStatus() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        List<ProjectRoleStatusResponse> responses = projectRoleService.getProjectRolesStatus(projectId);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).roleName()).isEqualTo("Developer");
        assertThat(responses.get(0).status()).isEqualTo("OPEN");
    }
}
