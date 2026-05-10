package pl.edu.agh.project_manager.controller.dto.notification;

import pl.edu.agh.project_manager.domain.entity.notification.Notification;
import pl.edu.agh.project_manager.domain.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        NotificationType type,
        String message,
        boolean isRead,
        UUID referenceId,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead(),
                notification.getReferenceId(),
                notification.getCreatedAt()
        );
    }
}