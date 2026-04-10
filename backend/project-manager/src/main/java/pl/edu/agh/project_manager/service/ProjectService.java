package pl.edu.agh.project_manager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.controller.dto.ProjectCreationRequest;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.ProjectCreationCommand;

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
    public Optional<UUID> newProjectCreation(ProjectCreationCommand command) {
        // Znalezienie projekt menadżera
        User projectManager = userRepository.findById(command.projectManagerId())
                .orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono managera o ID - " + command.projectManagerId()));

        // Stworzenie obiektu projektu
        Project project = projectBuilder(command.projectCreationRequest(), projectManager);

        // Zapisanie projektu
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
}
