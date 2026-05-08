package pl.edu.agh.project_manager.service.notification;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import pl.edu.agh.project_manager.controller.dto.notification.NotificationResponse;
import pl.edu.agh.project_manager.domain.entity.notification.Notification;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;
import pl.edu.agh.project_manager.domain.event.AssignmentRequestedEvent;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.notification.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void shouldCreateAndSaveNotificationOnAssignmentRequestedEvent() {
        // Given
        User recipient = new User();
        recipient.setId(UUID.randomUUID());
        UUID assignmentId = UUID.randomUUID();
        String message = "Prośba o przypisanie";

        AssignmentRequestedEvent event = new AssignmentRequestedEvent(assignmentId, recipient, message);

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);

        // When
        notificationService.onAssignmentRequested(event);

        // Then
        verify(notificationRepository).save(notificationCaptor.capture());
        Notification savedNotification = notificationCaptor.getValue();

        assertEquals(recipient, savedNotification.getRecipient());
        assertEquals(NotificationType.ASSIGNMENT_REQUESTED, savedNotification.getType());
        assertEquals(message, savedNotification.getMessage());
        assertEquals(assignmentId, savedNotification.getReferenceId());
        assertFalse(savedNotification.isRead());
    }

    @Test
    void shouldReturnMappedNotificationsForUser() {
        // Given
        UUID userId = UUID.randomUUID();
        int limit = 10;
        Pageable expectedPageable = PageRequest.of(0, limit);

        Notification notification = Notification.builder()
                .id(UUID.randomUUID())
                .type(NotificationType.SYSTEM_NEW_EMPLOYEE)
                .message("Test")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(userId, expectedPageable))
                .thenReturn(List.of(notification));

        // When
        List<NotificationResponse> result = notificationService.getNotificationsForUser(userId, limit);

        // Then
        assertEquals(1, result.size());
        assertEquals(notification.getId(), result.get(0).id());
        assertEquals(notification.getMessage(), result.get(0).message());
    }

    @Test
    void shouldMarkNotificationAsRead() {
        // Given
        UUID notificationId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        Notification notification = new Notification();
        notification.setId(notificationId);
        notification.setRead(false);

        when(notificationRepository.findById(notificationId)).thenReturn(Optional.of(notification));

        // When
        notificationService.markAsRead(notificationId, userId);

        // Then
        assertTrue(notification.isRead());
    }

    @Test
    void shouldThrowExceptionWhenMarkingNonExistentNotificationAsRead() {
        // Given
        UUID notificationId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        when(notificationRepository.findById(notificationId)).thenReturn(Optional.empty());

        // When & Then
        ApplicationException exception = assertThrows(
                ApplicationException.class,
                () -> notificationService.markAsRead(notificationId, userId)
        );

        assertEquals(ApiErrorCode.NOTIFICATION_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void shouldMarkAllAsRead() {
        // Given
        UUID userId = UUID.randomUUID();

        // When
        notificationService.markAllAsRead(userId);

        // Then
        verify(notificationRepository).markAllAsReadByUserId(userId);
    }
}