package pl.edu.agh.project_manager.controller.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import pl.edu.agh.project_manager.service.command.auth.LoginCommand;
import pl.edu.agh.project_manager.service.command.auth.RegisterCommand;

public record LoginRequest(
        @NotBlank(message = "Email nie może być pusty")
        @Email(message = "Niepoprawny format adresu email")
        String email,

        @NotBlank(message = "Hasło nie może być puste")
        String password
) {

    public LoginCommand toCommand() {
        return new LoginCommand(this.email, this.password);
    }

}
