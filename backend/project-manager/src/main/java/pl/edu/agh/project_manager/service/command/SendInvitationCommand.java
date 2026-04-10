package pl.edu.agh.project_manager.service.command;

public record SendInvitationCommand(
        String email,
        String activationToken
) {
}
