package pl.edu.agh.project_manager.controller.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import pl.edu.agh.project_manager.service.command.auth.RegisterCommand;

public record RegisterRequest(
        @NotBlank(message = "Token aktywacyjny jest wymagany")
        String activationToken,

        @NotBlank(message = "Imię nie może być puste")
        String name,

        @NotBlank(message = "Nazwisko nie może być puste")
        String surname,

        @NotBlank(message = "Hasło nie może być puste")
        @Size(min = 8, message = "Hasło musi mieć co najmniej 8 znaków")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()_]).{8,}$",
                message = "Hasło musi zawierać wielką literę, małą literę, cyfrę i znak specjalny"
        )
        String password
) {

    public RegisterCommand toCommand() {
        return new RegisterCommand(this.activationToken, this.name, this.surname, this.password);
    }
}