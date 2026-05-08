package pl.edu.agh.project_manager.service.notification;

import java.util.UUID;

public interface NotificationSender {
    void send(NotificationResponse notification, UUID recipientId);
}
