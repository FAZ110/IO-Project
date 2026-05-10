package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;

import java.util.UUID;

public record QualificationRejectedEvent(
        UUID qualificationId,
        User recipient,
        String message
) implements NotificationEvent {

    @Override
    public UUID referenceId() {
        return qualificationId;
    }

    @Override
    public NotificationType type() {
        return NotificationType.QUALIFICATION_REJECTED;
    }
}