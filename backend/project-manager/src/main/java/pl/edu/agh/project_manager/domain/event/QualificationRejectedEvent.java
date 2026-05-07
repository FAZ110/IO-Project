package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;

import java.util.UUID;

public record QualificationRejectedEvent(
        UUID qualificationId,
        User recipient,
        String message
) {}