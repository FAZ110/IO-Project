package pl.edu.agh.project_manager.service.report;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.controller.dto.project_risk.ProjectRiskResponse;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.security.access.ProjectAccess;
import pl.edu.agh.project_manager.service.command.project.SearchProjectCommand;
import pl.edu.agh.project_manager.service.project.ProjectRiskService;
import pl.edu.agh.project_manager.service.project.ProjectService;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private ProjectService projectService;
    
    @Mock
    private ProjectRiskService projectRiskService;
    
    @Mock
    private ProjectAccess projectAccess;
    
    @Mock
    private RiskCsvGenerator riskCsvGenerator;
    
    @Mock
    private ProjectPdfGenerator projectPdfGenerator;

    @Mock
    private RiskPdfGenerator riskPdfGenerator;

    @Mock
    private PortfolioCsvGenerator portfolioCsvGenerator;

    @InjectMocks
    private ReportService reportService;

    private UUID projectId;
    private UserPrincipal adminUser;
    private UserPrincipal normalUser;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        adminUser = new UserPrincipal(UUID.randomUUID(), "admin@test.com", "pass", "A", "A", List.of(new SimpleGrantedAuthority("ROLE_ADMINISTRATOR")), UserRole.ADMINISTRATOR);
        normalUser = new UserPrincipal(UUID.randomUUID(), "user@test.com", "pass", "U", "U", List.of(new SimpleGrantedAuthority("ROLE_COMMON")), UserRole.COMMON);
    }

    @Test
    @DisplayName("Should generate risks CSV when user has access")
    void generateProjectRisksCsv_HasAccess() {
        // Given
        when(projectAccess.canAccessProject(projectId, normalUser)).thenReturn(true);
        List<ProjectRiskResponse> risks = List.of(new ProjectRiskResponse(UUID.randomUUID(), "R1", "D1", 50,21,2));
        when(projectRiskService.getProjectRisks(projectId)).thenReturn(risks);
        byte[] expectedCsv = "test-csv".getBytes();
        when(riskCsvGenerator.generate(risks)).thenReturn(expectedCsv);

        // When
        byte[] result = reportService.generateProjectRisksCsv(projectId, normalUser);

        // Then
        assertThat(result).isEqualTo(expectedCsv);
        verify(projectRiskService).getProjectRisks(projectId);
        verify(riskCsvGenerator).generate(risks);
    }

    @Test
    @DisplayName("Should generate risks CSV for admin without explicit project access")
    void generateProjectRisksCsv_Admin() {
        // Given
        List<ProjectRiskResponse> risks = List.of();
        when(projectRiskService.getProjectRisks(projectId)).thenReturn(risks);
        when(riskCsvGenerator.generate(risks)).thenReturn(new byte[0]);

        // When
        reportService.generateProjectRisksCsv(projectId, adminUser);

        // Then
        verify(projectAccess, never()).canAccessProject(any(), any());
        verify(projectRiskService).getProjectRisks(projectId);
    }

    @Test
    @DisplayName("Should throw exception when generating CSV and no access")
    void generateProjectRisksCsv_NoAccess() {
        // Given
        when(projectAccess.canAccessProject(projectId, normalUser)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> reportService.generateProjectRisksCsv(projectId, normalUser))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak dostępu");
    }

    @Test
    @DisplayName("Should generate project card PDF when user has access")
    void generateProjectCardPdf_HasAccess() {
        // Given
        when(projectAccess.canAccessProject(projectId, normalUser)).thenReturn(true);
        ProjectResponse project = new ProjectResponse(projectId, "Test", "Desc", null, null, true, null, null);
        when(projectService.getProject(projectId)).thenReturn(project);
        byte[] expectedPdf = "test-pdf".getBytes();
        when(projectPdfGenerator.generate(project, "project-card-template")).thenReturn(expectedPdf);

        // When
        byte[] result = reportService.generateProjectCardPdf(projectId, normalUser);

        // Then
        assertThat(result).isEqualTo(expectedPdf);
        verify(projectService).getProject(projectId);
        verify(projectPdfGenerator).generate(project, "project-card-template");
    }

    @Test
    @DisplayName("Should generate risks PDF when user has access")
    void generateProjectRisksPdf_HasAccess() {
        // Given
        when(projectAccess.canAccessProject(projectId, normalUser)).thenReturn(true);
        List<ProjectRiskResponse> risks = List.of(new ProjectRiskResponse(UUID.randomUUID(), "R1", "D1", 50,27,2));
        when(projectRiskService.getProjectRisks(projectId)).thenReturn(risks);
        byte[] expectedPdf = "test-pdf".getBytes();
        when(riskPdfGenerator.generate(risks, "project-risks-template")).thenReturn(expectedPdf);

        // When
        byte[] result = reportService.generateProjectRisksPdf(projectId, normalUser);

        // Then
        assertThat(result).isEqualTo(expectedPdf);
        verify(projectRiskService).getProjectRisks(projectId);
        verify(riskPdfGenerator).generate(risks, "project-risks-template");
    }

    @Test
    @DisplayName("Should generate portfolio CSV")
    void generatePortfolioCsv_Success() {
        // Given
        UUID groupId = UUID.randomUUID();
        List<ProjectResponse> projects = List.of(new ProjectResponse(projectId, "Test", "Desc", null, null, true, null, null));
        when(projectService.searchProjects(any(SearchProjectCommand.class))).thenReturn(projects);
        byte[] expectedCsv = "test-csv".getBytes();
        when(portfolioCsvGenerator.generate(projects)).thenReturn(expectedCsv);

        // When
        byte[] result = reportService.generatePortfolioCsv(groupId, normalUser);

        // Then
        assertThat(result).isEqualTo(expectedCsv);
        verify(projectService).searchProjects(any(SearchProjectCommand.class));
        verify(portfolioCsvGenerator).generate(projects);
    }
}