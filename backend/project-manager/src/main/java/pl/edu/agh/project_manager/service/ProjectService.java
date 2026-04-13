package pl.edu.agh.project_manager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.controller.dto.ProjectCreationRequest;
import pl.edu.agh.project_manager.controller.dto.RiskRequest;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.Risk;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.ProjectCreationCommand;
import pl.edu.agh.project_manager.service.command.RiskCommand;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    // User repozytorium
    private final UserRepository userRepository;

    // Projekt repozytorium
    private final ProjectRepository projectRepository;

    // Stworzenie nowego projektu
    @Transactional
    public UUID createProject(ProjectCreationCommand command) {
        // Znalezienie projekt menadżera
        User projectManager = userRepository.findById(command.projectManagerId())
                .orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono managera o ID - " + command.projectManagerId()));

        // Stworzenie obiektu projektu
        Project project = projectBuilder(command, projectManager);

        // Dodanie ryzyk
        addRisksToProject(project, command.risks());

        // Zapisanie projektu wraz z ryzykami
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

            // Dodanie ryzyka do projektu
            project.addRisk(risk);
        });
    }
}
