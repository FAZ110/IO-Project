package pl.edu.agh.project_manager.controller.dto.user;

import pl.edu.agh.project_manager.controller.dto.qualification.QualificationResponse;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;

import java.util.List;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String name,
        String surname,
        UserRole role,
        UserStatus status,
        String supervisorEmail,
        List<QualificationResponse> qualifications
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getSurname(),
                user.getUserRole(),
                user.getUserStatus(),
                user.getSupervisor() != null ? user.getSupervisor().getEmail() : null,

                user.getQualifications() != null ?
                        user.getQualifications().stream()
                                .map(QualificationResponse::from)
                                .toList()
                        : List.of()
        );
    }
}