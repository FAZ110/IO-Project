package pl.edu.agh.project_manager.service.report;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.controller.dto.project.RiskResponse;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.security.access.ProjectAccess;
import pl.edu.agh.project_manager.service.command.project.SearchProjectCommand;
import pl.edu.agh.project_manager.service.project.ProjectRiskService;
import pl.edu.agh.project_manager.service.project.ProjectService;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ProjectService projectService;
    private final ProjectRiskService projectRiskService;
    private final ProjectAccess projectAccess;
    private final RiskCsvGenerator riskCsvGenerator;
    private final ProjectPdfGenerator projectPdfGenerator;
    private final RiskPdfGenerator riskPdfGenerator;
    private final PortfolioCsvGenerator portfolioCsvGenerator;

    public byte[] generateProjectRisksCsv(UUID projectId, UserPrincipal user) {
        checkAccess(projectId, user);

        List<RiskResponse> risks = projectRiskService.getProjectRisks(projectId);
        return riskCsvGenerator.generate(risks);
    }

    public byte[] generateProjectCardPdf(UUID projectId, UserPrincipal user) {
        checkAccess(projectId, user);

        ProjectResponse project = projectService.getProject(projectId);
        return projectPdfGenerator.generate(project, "project-card-template");
    }

    public byte[] generateProjectRisksPdf(UUID projectId, UserPrincipal user) {
        checkAccess(projectId, user);

        List<RiskResponse> risks = projectRiskService.getProjectRisks(projectId);
        return riskPdfGenerator.generate(risks, "project-risks-template");
    }

    public byte[] generatePortfolioCsv(UUID groupId, UserPrincipal user) {
        SearchProjectCommand command = new SearchProjectCommand(user, null, groupId, null, false);
        List<ProjectResponse> projects = projectService.searchProjects(command);
        return portfolioCsvGenerator.generate(projects);
    }

    private void checkAccess(UUID projectId, UserPrincipal user) {
        boolean hasAccess = user.userRole().name().equals("ADMINISTRATOR") ||
                user.userRole().name().equals("AUTHORITY") ||
                projectAccess.canAccessProject(projectId, user);

        if (!hasAccess) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "Brak dostępu do projektu.");
        }
    }
}
