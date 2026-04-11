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
    public Optional<UUID> newProjectCreation(ProjectCreationCommand command) {
        // Znalezienie projekt menadżera
        User projectManager = userRepository.findById(command.projectManagerId())
                .orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono managera o ID - " + command.projectManagerId()));

        // Stworzenie obiektu projektu
        Project project = projectBuilder(command.projectCreationRequest(), projectManager);

        // Dodanie ryzyk
        addRisksToProject(project, command.projectCreationRequest().risks());

        // Zapisanie projektu wraz z ryzykami
        Project savedProject = projectRepository.save(project);

        // Zwrócenie ID nowego projektu
        return Optional.ofNullable(savedProject.getId());
    }

    private Project projectBuilder(ProjectCreationRequest request, User projectManager) {
        return Project.builder()
                .title(request.title())
                .description(request.description())
                .projectManagerUser(projectManager)
                .startDate(request.startDate())
                .isActive(request.isActive())
                .walletId(request.walletId())
                .programId(request.programId())
                .build();
    }

    private void addRisksToProject(Project project, List<RiskRequest> risks) {
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
