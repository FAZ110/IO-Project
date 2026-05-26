package pl.edu.agh.project_manager.service.project;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.controller.dto.project_risk.ProjectRiskResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectRisk;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.RiskRepository;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectRiskService {

    private final RiskRepository riskRepository;
    private final ProjectService projectService;

    @Transactional
    public ProjectRiskResponse createProjectRisk(RiskCommand command, UUID projectId) {
        Project project = projectService.getProjectEntityOrThrow(projectId);

        ProjectRisk risk = buildRisk(command);
        risk.setProject(project);

        ProjectRisk savedRisk = riskRepository.save(risk);
        return ProjectRiskResponse.from(savedRisk);
    }

    public List<ProjectRiskResponse> getProjectRisks(UUID projectId) {
        projectService.checkProjectExistsOrThrow(projectId);

        return riskRepository.findAllByProjectId(projectId)
                .stream()
                .map(ProjectRiskResponse::from)
                .toList();
    }

    @Transactional
    public void deleteProjectRisk(UUID projectId, UUID riskId) {
        ProjectRisk risk = getRiskOrThrow(riskId);

        if (!risk.getProject().getId().equals(projectId)) {
            throw new ApplicationException(ApiErrorCode.RISK_NOT_FOUND, "Risk does not belong to this project");
        }

        riskRepository.delete(risk);
    }

    @Transactional
    public ProjectRiskResponse updateProjectRisk(UUID projectId, UUID riskId, RiskCommand command) {
        ProjectRisk risk = getRiskOrThrow(riskId);

        if (!risk.getProject().getId().equals(projectId)) {
            throw new ApplicationException(ApiErrorCode.RISK_NOT_FOUND, "Risk does not belong to this project");
        }

        if (command.name() != null) risk.setName(command.name());
        if (command.description() != null) risk.setDescription(command.description());
        if (command.probability() != null) risk.setProbability(command.probability());
        if (command.impact() != null) risk.setImpact(command.impact());

        return ProjectRiskResponse.from(risk);
    }

    private ProjectRisk getRiskOrThrow(UUID riskId) {
        return riskRepository.findById(riskId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.RISK_NOT_FOUND, "Cannot find provided risk - " + riskId));
    }

    private ProjectRisk buildRisk(RiskCommand command) {
        return ProjectRisk.builder()
                .name(command.name())
                .description(command.description())
                .probability(command.probability())
                .impact(command.impact())
                .build();
    }
}