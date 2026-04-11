package pl.edu.agh.project_manager.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ManagerUserInvitationRequest(
        @NotBlank(message = "Email nie może być pusty")
        @Email(message = "Niepoprawny format adresu email")
        String email
) {

}
