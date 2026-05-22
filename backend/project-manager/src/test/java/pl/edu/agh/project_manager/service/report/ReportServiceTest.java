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
import pl.edu.agh.project_manager.controller.dto.project.RiskResponse;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.security.access.ProjectAccess;
import pl.edu.agh.project_manager.service.project.ProjectRiskService;
import pl.edu.agh.project_manager.service.project.ProjectService;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
        List<RiskResponse> risks = List.of(new RiskResponse(UUID.randomUUID(), "R1", "D1", 50));
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
        List<RiskResponse> risks = List.of();
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
    @DisplayName("Should throw exception when generating PDF and no access")
    void generateProjectCardPdf_NoAccess() {
        // Given
        when(projectAccess.canAccessProject(projectId, normalUser)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> reportService.generateProjectCardPdf(projectId, normalUser))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak dostępu");
    }
}
