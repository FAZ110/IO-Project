package pl.edu.agh.project_manager.security.access;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.repository.notification.NotificationRepository;
import pl.edu.agh.project_manager.security.UserPrincipal;

import java.util.UUID;

@Component("notificationAccess")
@RequiredArgsConstructor
public class NotificationAccess {

    private final NotificationRepository notificationRepository;

    public boolean canMarkAsRead(UUID notificationId, UserPrincipal currentUser) {
        if (currentUser == null) {
            return false;
        }

        UUID userId = currentUser.userId();

        return notificationRepository.existsByIdAndRecipientId(notificationId, userId);
    }
}
