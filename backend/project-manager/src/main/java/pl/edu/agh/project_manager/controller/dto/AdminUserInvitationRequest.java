package pl.edu.agh.project_manager.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminUserInvitationRequest(
        @NotBlank(message = "Email nie może być pusty")
        @Email(message = "Niepoprawny format adresu email")
        String email,

        @NotNull(message = "Rola musi zostać określona")
        AssignableRole role
) {
}
