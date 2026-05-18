package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;

import java.util.List;
import java.util.UUID;

public record QualificationAcceptedEvent(
        UUID qualificationId,
        User recipient,
        List<String> skills
) implements NotificationEvent {

    @Override
    public UUID referenceId() {
        return qualificationId;
    }

    @Override
    public NotificationType type() {
        return NotificationType.QUALIFICATION_ACCEPTED;
    }

    @Override
    public String buildMessage() {
        return "Zatwierdzono Twoje kwalifikacje: " + String.join(", ", skills);
    }
}