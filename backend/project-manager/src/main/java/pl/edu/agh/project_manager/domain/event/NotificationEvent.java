package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;

import java.util.UUID;

public interface NotificationEvent {
    User recipient();
    UUID referenceId();
    NotificationType type();
    String buildMessage();
}