package pl.edu.agh.project_manager.service.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;
import pl.edu.agh.project_manager.controller.dto.PagedResponse;
import pl.edu.agh.project_manager.controller.dto.notification.NotificationResponse;
import pl.edu.agh.project_manager.domain.entity.notification.Notification;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;
import pl.edu.agh.project_manager.domain.event.*;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.notification.NotificationRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationSender notificationSender;

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onNotificationEvent(NotificationEvent event) {
        create(event.recipient(), event.type(), event.message(), event.referenceId());
    }

    private void create(User recipient, NotificationType type, String message, UUID referenceId) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .build();

        Notification savedNotification = notificationRepository.save(notification);

        NotificationResponse response = NotificationResponse.from(savedNotification);
        notificationSender.send(response, recipient.getId());
    }

    @Transactional(readOnly = true)
    public PagedResponse<NotificationResponse> getNotificationsForUser(UUID userId, int page, int size, boolean unreadOnly) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Notification> notificationPage;

        if (unreadOnly) {
            notificationPage = notificationRepository.findAllByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId, pageable);
        } else {
            notificationPage = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(userId, pageable);
        }

        return PagedResponse.from(notificationPage, NotificationResponse::from);
    }

    @Transactional
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ApplicationException(
                        ApiErrorCode.NOTIFICATION_NOT_FOUND,
                        "Cannot find notification: " + notificationId)
                );

        notification.setRead(true);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }
}