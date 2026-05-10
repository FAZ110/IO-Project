package pl.edu.agh.project_manager.service.notification;

import pl.edu.agh.project_manager.controller.dto.notification.NotificationResponse;

import java.util.UUID;

public interface NotificationSender {
    void send(NotificationResponse notification, UUID recipientId);
}
