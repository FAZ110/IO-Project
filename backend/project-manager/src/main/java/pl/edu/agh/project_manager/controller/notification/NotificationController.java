package pl.edu.agh.project_manager.controller.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import pl.edu.agh.project_manager.controller.dto.PagedResponse;
import pl.edu.agh.project_manager.controller.dto.notification.NotificationResponse;
import pl.edu.agh.project_manager.infrastructure.notification.SseSubscriber;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.notification.NotificationService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final SseSubscriber sseSubscriber;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> streamNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        SseEmitter emitter = sseSubscriber.subscribe(userPrincipal.userId());
        return ResponseEntity.ok(emitter);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Integer>> getUnreadCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        int count = notificationService.getUnreadCount(userPrincipal.userId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<NotificationResponse>> getUserNotifications(
            @RequestParam(defaultValue = "true") boolean unreadOnly,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(
                notificationService.getNotificationsForUser(
                        userPrincipal.userId(),
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        unreadOnly
                )
        );
    }

    @PatchMapping("/{notificationId}/mark-as-read")
    @PreAuthorize("@notificationAccess.canMarkAsRead(#notificationId, authentication.principal)")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID notificationId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        notificationService.markAsRead(notificationId, userPrincipal.userId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/mark-all-as-read")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        notificationService.markAllAsRead(userPrincipal.userId());
        return ResponseEntity.noContent().build();
    }

}