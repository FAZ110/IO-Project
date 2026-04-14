package pl.edu.agh.project_manager.service.command.invitation;

public record SendInvitationCommand(
        String email,
        String activationToken
) {
}
