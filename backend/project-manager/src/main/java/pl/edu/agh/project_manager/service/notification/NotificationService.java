package pl.edu.agh.project_manager.service.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;
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

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssignmentRequested(AssignmentRequestedEvent event) {
        create(event.recipient(), NotificationType.ASSIGNMENT_REQUESTED, event.message(), event.assignmentId());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssignmentAccepted(AssignmentAcceptedEvent event) {
        create(event.recipient(), NotificationType.ASSIGNMENT_ACCEPTED, event.message(), event.assignmentId());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onAssignmentRejected(AssignmentRejectedEvent event) {
        create(event.recipient(), NotificationType.ASSIGNMENT_REJECTED, event.message(), event.assignmentId());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onQualificationRequested(QualificationRequestedEvent event) {
        create(event.recipient(), NotificationType.QUALIFICATION_REQUESTED, event.message(), event.qualificationId());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onQualificationAccepted(QualificationAcceptedEvent event) {
        create(event.recipient(), NotificationType.QUALIFICATION_ACCEPTED, event.message(), event.qualificationId());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onQualificationRejected(QualificationRejectedEvent event) {
        create(event.recipient(), NotificationType.QUALIFICATION_REJECTED, event.message(), event.qualificationId());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onSystemNewEmployee(SystemNewEmployeeEvent event) {
        create(event.recipient(), NotificationType.SYSTEM_NEW_EMPLOYEE, event.message(), event.employeeId());
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
    public List<NotificationResponse> getNotificationsForUser(UUID userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);

        return notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(userId, pageable)
                .stream()
                .map(NotificationResponse::from)
                .toList();
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