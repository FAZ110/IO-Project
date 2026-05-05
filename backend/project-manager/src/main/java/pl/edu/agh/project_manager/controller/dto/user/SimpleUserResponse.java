package pl.edu.agh.project_manager.controller.dto.user;

import pl.edu.agh.project_manager.domain.entity.user.User;

import java.util.UUID;

public record SimpleUserResponse(
        UUID id,
        String name,
        String surname
) {

    public static SimpleUserResponse fromUser(User user) {
        return new SimpleUserResponse(
                user.getId(),
                user.getName(),
                user.getSurname()
        );
    }
}
