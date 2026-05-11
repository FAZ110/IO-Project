package pl.edu.agh.project_manager.infrastructure.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import pl.edu.agh.project_manager.controller.dto.notification.NotificationResponse;
import pl.edu.agh.project_manager.service.notification.NotificationSender;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class SseNotificationSender implements NotificationSender, SseSubscriber {

    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @Override
    public SseEmitter subscribe(UUID userId) {
        SseEmitter emitter = new SseEmitter(3600000L);

        emitters.put(userId, emitter);
        log.info("User {} subscribed to SSE notifications", userId);

        emitter.onCompletion(() -> {
            emitters.remove(userId);
            log.info("SSE connection completed for user {}", userId);
        });
        emitter.onTimeout(() -> {
            emitters.remove(userId);
            log.info("SSE connection timed out for user {}", userId);
        });
        emitter.onError((e) -> {
            emitters.remove(userId);
            log.error("SSE connection error for user {}: {}", userId, e.getMessage());
        });

        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connected"));
        } catch (IOException e) {
            emitters.remove(userId);
        }

        return emitter;
    }

    @Override
    public void send(NotificationResponse notification, UUID recipientId) {
        SseEmitter emitter = emitters.get(recipientId);

        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("NOTIFICATION")
                        .data(notification));
                log.info("Push notification sent to user {}", recipientId);
            } catch (IOException e) {
                log.warn("Failed to send notification to user {}. Removing dead emitter.", recipientId);
                emitters.remove(recipientId);
            }
        }
    }
}