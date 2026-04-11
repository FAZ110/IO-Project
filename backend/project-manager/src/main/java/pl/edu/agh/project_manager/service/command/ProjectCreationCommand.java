package pl.edu.agh.project_manager.service.command;

import pl.edu.agh.project_manager.controller.dto.ProjectCreationRequest;

import java.util.UUID;

public record ProjectCreationCommand(
        ProjectCreationRequest projectCreationRequest,
        UUID projectManagerId
) {
}
