package pl.edu.agh.project_manager.service.command.auth;

public record LoginCommand(
        String email,
        String password
) {
}
