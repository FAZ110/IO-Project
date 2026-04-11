package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.project_manager.controller.dto.ProjectCreationRequest;
import pl.edu.agh.project_manager.exception.CannotCreateProjectException;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.ProjectService;
import pl.edu.agh.project_manager.service.command.ProjectCreationCommand;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProjectManagement {
    // Serwis do zarządzania projektami
    private final ProjectService projectService;

    @PostMapping("/project")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<UUID> projectCreation(
            @Valid @RequestBody ProjectCreationRequest projectCreationRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        // Stworzenie komendy
        ProjectCreationCommand command = new ProjectCreationCommand(
                projectCreationRequest, userPrincipal.userId()
        );

        // Tworzenie nowego projektu
        Optional<UUID> newProjectId = projectService.newProjectCreation(command);

        // Zwrócenie ID projektu
        if (newProjectId.isEmpty()) throw new CannotCreateProjectException("Nie można stworzyć projektu!");
        return ResponseEntity.status(HttpStatus.CREATED).body(newProjectId.get());
    }
}
