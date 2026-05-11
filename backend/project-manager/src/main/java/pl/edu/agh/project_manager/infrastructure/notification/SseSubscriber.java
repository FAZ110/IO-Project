package pl.edu.agh.project_manager.infrastructure.notification;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

public interface SseSubscriber {
    SseEmitter subscribe(UUID userId);
}
