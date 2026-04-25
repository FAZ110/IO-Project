package pl.edu.agh.project_manager.controller.dto.user;

import pl.edu.agh.project_manager.domain.entity.User;

import java.util.UUID;

public record UserBasicResponse (
        UUID id,
        String email,
        String name,
        String surname

) {
    public static UserBasicResponse from(User user) {
        return new UserBasicResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getSurname()
        );
    }
}