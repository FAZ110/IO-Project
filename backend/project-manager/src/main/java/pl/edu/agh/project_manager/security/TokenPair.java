package pl.edu.agh.project_manager.security;

public record TokenPair(
        String accessToken,
        String refreshToken
) {
}
