package pl.edu.agh.project_manager.service.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;
import pl.edu.agh.project_manager.domain.entity.notification.Notification;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;
import pl.edu.agh.project_manager.domain.event.AssignmentAcceptedEvent;
import pl.edu.agh.project_manager.domain.event.AssignmentRequestedEvent;
import pl.edu.agh.project_manager.domain.event.QualificationRequestedEvent;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.notification.NotificationRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssignmentRequested(AssignmentRequestedEvent event) {
        create(event.recipient(), NotificationType.ASSIGNMENT_REQUESTED, event.message(), event.assignmentId());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onQualificationRequested(QualificationRequestedEvent event) {
        create(event.recipient(), NotificationType.QUALIFICATION_REQUESTED, event.message(), event.qualificationId());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssignmentAccepted(AssignmentAcceptedEvent event) {
        create(event.recipient(), NotificationType.ASSIGNMENT_ACCEPTED, event.message(), event.assignmentId());
    }

    private void create(User recipient, NotificationType type, String message, UUID referenceId) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getAllForUser(UUID userId) {
        return notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Notification> getFirst50ForUser(UUID userId) {
        return notificationRepository.findTop50ByRecipientIdOrderByCreatedAtDesc(userId);
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