package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;

import java.util.List;
import java.util.UUID;

public record QualificationRequestedEvent(
        UUID qualificationId,
        User recipient,
        String employeeFullName,
        List<String> skills
) implements NotificationEvent {

    @Override
    public UUID referenceId() {
        return qualificationId;
    }

    @Override
    public NotificationType type() {
        return NotificationType.QUALIFICATION_REQUESTED;
    }

    @Override
    public String buildMessage() {
        return employeeFullName + " zgłasza nowe umiejętności: " + String.join(", ", skills);
    }
}