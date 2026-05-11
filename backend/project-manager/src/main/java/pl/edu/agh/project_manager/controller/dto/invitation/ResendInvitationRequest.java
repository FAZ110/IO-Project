package pl.edu.agh.project_manager.controller.dto.invitation;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ResendInvitationRequest(
        @NotNull(message = "ID użytkownika nie może być puste")
        UUID userId
) {
}
