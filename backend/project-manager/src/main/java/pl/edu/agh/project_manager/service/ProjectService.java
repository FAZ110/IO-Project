package pl.edu.agh.project_manager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectGroups;
import pl.edu.agh.project_manager.domain.entity.Risk;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectGroupsRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.ProjectCreationCommand;
import pl.edu.agh.project_manager.service.command.RiskCommand;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectGroupsRepository projectGroupRepository;

    @Transactional
    public UUID createProject(ProjectCreationCommand command) {
        // Find project manager
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

    private Project buildProject(ProjectCreationCommand command, User projectManager) {
        return Project.builder()
                .title(command.title())
                .description(command.description())
                .projectManager(projectManager)
                .startDate(command.startDate())
                .isActive(command.isActive())
                .build();
    }

    private void addRisksToProject(Project project, List<RiskCommand> risks) {
        if (risks == null) return;

        risks.forEach(riskRequest -> {
            Risk risk = Risk.builder()
                    .name(riskRequest.name())
                    .description(riskRequest.description())
                    .probability(riskRequest.probability())
                    .build();

            project.addRisk(risk);
        });
    }
}
