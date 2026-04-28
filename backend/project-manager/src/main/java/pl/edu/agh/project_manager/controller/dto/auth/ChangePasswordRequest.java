package pl.edu.agh.project_manager.controller.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "Obecne hasło nie może być puste")
        String currentPassword,

        @NotBlank(message = "Nowe hasło nie może być puste")
        @Size(min = 8, message = "Hasło musi mieć co najmniej 8 znaków")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()_]).{8,}$",
                message = "Hasło musi zawierać wielką literę, małą literę, cyfrę i znak specjalny"
        )
        String newPassword
) {}
