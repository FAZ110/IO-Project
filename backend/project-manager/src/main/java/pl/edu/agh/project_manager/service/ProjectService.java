package pl.edu.agh.project_manager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.controller.dto.RiskResponse;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectRisk;
import pl.edu.agh.project_manager.domain.entity.ProjectGroups;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectGroupsRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.RiskRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectGroupsRepository projectGroupRepository;
    private final RiskRepository riskRepository;

    @Transactional
    public UUID createProject(ProjectCreationCommand command) {
        User projectManager = userRepository.findById(command.projectManagerId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_MANAGER_NOT_FOUND, "Cannot found provided project manager - " + command.projectManagerId()));

        ProjectGroups projectGroup = null;
        if (command.projectGroupId() != null) {
            projectGroup = projectGroupRepository.findById(command.projectGroupId())
                    .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_GROUP_NOT_FOUND, "Cannot found provided project group - " + command.projectGroupId()));
        }

        Project project = buildProject(command, projectManager);
        project.setProjectGroup(projectGroup);
        projectManager.getProjects().add(project);

        addRisksToProject(project, command.risks());

        Project savedProject = projectRepository.save(project);

        return savedProject.getId();
    }

    @Transactional
    public void deleteProjectRisk(UUID projectId, UUID riskId, UUID projectManagerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot found provided project - " + projectId));

        if (!project.getProjectManager().getId().equals(projectManagerId)) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "Only project manager can delete project");
        }

        ProjectRisk removedRisk = project.getRisks().stream()
                .filter(risk -> risk.getId().equals(riskId))
                .findFirst()
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.RISK_NOT_FOUND, "Cannot found provided risk - " + riskId));

        project.removeRisk(removedRisk);
    }

    @Transactional
    public RiskResponse updateProjectRisk(UUID projectId, UUID riskId, UUID projectManagerId, RiskCommand command) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot found provided project - " + projectId));

        if (!project.getProjectManager().getId().equals(projectManagerId)) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "Only project manager can update project risks");
        }

        ProjectRisk risk = project.getRisks()
                .stream()
                .filter(r -> r.getId().equals(riskId))
                .findFirst()
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.RISK_NOT_FOUND, "Cannot found provided risk - " + riskId));

        if (command.name() != null) {
            risk.setName(command.name());
        }
        if (command.description() != null) {
            risk.setDescription(command.description());
        }
        if (command.probability() != null) {
            risk.setProbability(command.probability());
        }

        return new RiskResponse(
                risk.getId(),
                risk.getName(),
                risk.getDescription(),
                risk.getProbability()
        );
    }

    @Transactional
    public RiskResponse createProjectRisk(RiskCommand command,  UUID projectManagerId, UUID projectId) {
        User projectManager = userRepository.findById(projectManagerId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_MANAGER_NOT_FOUND, "Cannot found provided project manager - " + projectManagerId));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot found provided project - " + projectId));

        ProjectRisk risk = buildRisk(command, projectManager);
        project.addRisk(risk);

        ProjectRisk savedRisk = riskRepository.save(risk);

        return new RiskResponse(
                savedRisk.getId(),
                savedRisk.getName(),
                savedRisk.getDescription(),
                savedRisk.getProbability()
        );
    }

    private Project buildProject(ProjectCreationCommand command, User projectManager) {
        return Project.builder()
                .title(command.title())
                .description(command.description())
                .projectManager(projectManager)
                .startDate(command.startDate())
                .isActive(command.isActive())
                .build();
    }

    private ProjectRisk buildRisk(RiskCommand command, User projectManager) {
        return ProjectRisk.builder()
                .name(command.name())
                .description(command.description())
                .probability(command.probability())
                .build();
    }

    private void addRisksToProject(Project project, List<RiskCommand> risks) {
        if (risks == null) return;

        risks.forEach(riskRequest -> {
            ProjectRisk  risk = ProjectRisk.builder()
                    .name(riskRequest.name())
                    .description(riskRequest.description())
                    .probability(riskRequest.probability())
                    .build();

            project.addRisk(risk);
        });
    }
}
