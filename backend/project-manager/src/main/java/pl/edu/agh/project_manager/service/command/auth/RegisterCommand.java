package pl.edu.agh.project_manager.service.command.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterCommand(
        String activationToken,
        String name,
        String surname,
        String password
) {
}
