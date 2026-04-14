package pl.edu.agh.project_manager.service.command.auth;

public record RegisterCommand(
        String activationToken,
        String name,
        String surname,
        String password
) {
}
