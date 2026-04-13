package pl.edu.agh.project_manager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.Risk;
import pl.edu.agh.project_manager.domain.entity.User;
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

    @Transactional
    public UUID createProject(ProjectCreationCommand command) {
        // Znalezienie projekt menadżera
        User projectManager = userRepository.findById(command.projectManagerId())
                .orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono managera o ID - " + command.projectManagerId()));

        Project project = projectBuilder(command, projectManager);

        addRisksToProject(project, command.risks());

        Project savedProject = projectRepository.save(project);

        // Zwrócenie ID nowego projektu
        return savedProject.getId();
    }

    private Project projectBuilder(ProjectCreationCommand command, User projectManager) {
        return Project.builder()
                .title(command.title())
                .description(command.description())
                .projectManagerUser(projectManager)
                .startDate(command.startDate())
                .isActive(command.isActive())
                .walletId(command.walletId())
                .programId(command.programId())
                .build();
    }

    private void addRisksToProject(Project project, List<RiskCommand> risks) {
        if (risks == null) return;

        risks.forEach(riskRequest -> {
            // Tworzenie modelu ryzyka
            Risk risk = Risk.builder()
                    .name(riskRequest.name())
                    .description(riskRequest.description())
                    .probability(riskRequest.probability())
                    .build();

            project.addRisk(risk);
        });
    }
}
