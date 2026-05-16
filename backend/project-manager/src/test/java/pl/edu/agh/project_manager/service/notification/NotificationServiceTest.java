package pl.edu.agh.project_manager.service.notification;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import pl.edu.agh.project_manager.controller.dto.PagedResponse;
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

    @Mock
    private NotificationSender notificationSender;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void shouldCreateSaveAndSendNotificationWhenNotificationEventIsPublished() {
        // Given
        User recipient = new User();
        recipient.setId(UUID.randomUUID());
        UUID assignmentId = UUID.randomUUID();

        String projectName = "Projekt Apollo";
        String employeeName = "Jan Kowalski";

        AssignmentRequestedEvent event = new AssignmentRequestedEvent(
                assignmentId,
                recipient,
                projectName,
                employeeName
        );

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);

        Notification savedMock = Notification.builder()
                .id(UUID.randomUUID())
                .recipient(recipient)
                .type(NotificationType.ASSIGNMENT_REQUESTED)
                .message(event.buildMessage())
                .referenceId(assignmentId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(notificationRepository.save(any(Notification.class))).thenReturn(savedMock);

        // When
        notificationService.onNotificationEvent(event);

        // Then
        verify(notificationRepository).save(notificationCaptor.capture());
        Notification capturedNotification = notificationCaptor.getValue();

        assertEquals(NotificationType.ASSIGNMENT_REQUESTED, capturedNotification.getType());

        assertEquals("Kierownik projektu Projekt Apollo prosi o alokację pracownika Jan Kowalski", capturedNotification.getMessage());

        verify(notificationSender).send(any(NotificationResponse.class), eq(recipient.getId()));
    }

    @Test
    void shouldReturnPagedNotificationsForUserWhenUnreadOnlyIsFalse() {
        // Given
        UUID userId = UUID.randomUUID();
        int page = 0;
        int size = 10;
        Pageable expectedPageable = PageRequest.of(page, size);

        Notification notification = Notification.builder()
                .id(UUID.randomUUID())
                .type(NotificationType.SYSTEM_NEW_EMPLOYEE)
                .message("Test All")
                .isRead(true)
                .createdAt(LocalDateTime.now())
                .build();

        Page<Notification> notificationPage = new PageImpl<>(List.of(notification), expectedPageable, 1);

        when(notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(userId, expectedPageable))
                .thenReturn(notificationPage);

        // When
        PagedResponse<NotificationResponse> result = notificationService.getNotificationsForUser(userId, page, size, false);

        // Then
        assertEquals(1, result.items().size());
        assertEquals(notification.getId(), result.items().get(0).id());
        assertEquals("Test All", result.items().get(0).message());
        assertEquals(1, result.totalCount());
        assertEquals(0, result.pageNumber());
    }

    @Test
    void shouldReturnPagedNotificationsForUserWhenUnreadOnlyIsTrue() {
        // Given
        UUID userId = UUID.randomUUID();
        int page = 0;
        int size = 10;
        Pageable expectedPageable = PageRequest.of(page, size);

        Notification notification = Notification.builder()
                .id(UUID.randomUUID())
                .type(NotificationType.ASSIGNMENT_REQUESTED)
                .message("Test Unread")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        Page<Notification> notificationPage = new PageImpl<>(List.of(notification), expectedPageable, 1);

        when(notificationRepository.findAllByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId, expectedPageable))
                .thenReturn(notificationPage);

        // When
        PagedResponse<NotificationResponse> result = notificationService.getNotificationsForUser(userId, page, size, true);

        // Then
        assertEquals(1, result.items().size());
        assertEquals(notification.getId(), result.items().get(0).id());
        assertEquals("Test Unread", result.items().get(0).message());
        assertFalse(result.items().get(0).isRead());
        assertEquals(1, result.totalPages());
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

    @Test
    void shouldCleanupOldReadNotifications() {
        // Given
        ArgumentCaptor<LocalDateTime> dateCaptor = ArgumentCaptor.forClass(LocalDateTime.class);

        when(notificationRepository.deleteReadAndOlderThan(any(LocalDateTime.class))).thenReturn(5);

        // When
        notificationService.cleanupOldReadNotifications();

        // Then
        verify(notificationRepository).deleteReadAndOlderThan(dateCaptor.capture());
        LocalDateTime capturedDate = dateCaptor.getValue();

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        assertTrue(capturedDate.isBefore(thirtyDaysAgo.plusMinutes(1)));
        assertTrue(capturedDate.isAfter(thirtyDaysAgo.minusMinutes(1)));
    }
}