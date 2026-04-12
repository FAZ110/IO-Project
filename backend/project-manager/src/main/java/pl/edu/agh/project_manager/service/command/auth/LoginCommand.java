package pl.edu.agh.project_manager.service.command.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginCommand(
        String email,
        String password
) {
}
