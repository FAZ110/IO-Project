package pl.edu.agh.project_manager.controller.dto.user;

import pl.edu.agh.project_manager.domain.entity.user.User;

import java.util.UUID;

public record BasicUserResponse(
        UUID id,
        String email,
        String name,
        String surname

) {
    public static BasicUserResponse from(User user) {
        return new BasicUserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getSurname()
        );
    }
}