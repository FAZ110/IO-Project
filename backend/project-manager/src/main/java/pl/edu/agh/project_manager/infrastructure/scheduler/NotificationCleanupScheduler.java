package pl.edu.agh.project_manager.infrastructure.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.service.notification.NotificationService;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationCleanupScheduler {

    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 3 * * *")
    public void scheduleNotificationCleanup() {
        log.info("Czyszczenia starych powiadomień...");
        notificationService.cleanupOldReadNotifications();
    }
}