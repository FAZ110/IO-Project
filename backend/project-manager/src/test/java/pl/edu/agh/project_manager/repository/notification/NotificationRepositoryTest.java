package pl.edu.agh.project_manager.repository.notification;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;
import pl.edu.agh.project_manager.domain.entity.notification.Notification;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.repository.user.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private User testUser1;
    private User testUser2;

    @BeforeEach
    void setUp() {
        testUser1 = userRepository.saveAndFlush(User.builder()
                .email("user1@agh.edu.pl")
                .name("Jan")
                .surname("Testowy")
                .password("hash")
                .userRole(UserRole.COMMON)
                .userStatus(UserStatus.ACTIVE)
                .build());

        testUser2 = userRepository.saveAndFlush(User.builder()
                .email("user2@agh.edu.pl")
                .name("Anna")
                .surname("Inna")
                .password("hash")
                .userRole(UserRole.COMMON)
                .userStatus(UserStatus.ACTIVE)
                .build());
    }

    @Test
    void shouldMarkAllUnreadNotificationsAsReadForSpecificUser() {
        Notification n1 = saveNotification(testUser1, false);
        Notification n2 = saveNotification(testUser1, false);
        Notification n3 = saveNotification(testUser1, true);

        Notification n4 = saveNotification(testUser2, false);

        // When
        notificationRepository.markAllAsReadByUserId(testUser1.getId());

        // Then
        assertTrue(notificationRepository.findById(n1.getId()).orElseThrow().isRead());
        assertTrue(notificationRepository.findById(n2.getId()).orElseThrow().isRead());
        assertTrue(notificationRepository.findById(n3.getId()).orElseThrow().isRead());

        assertFalse(notificationRepository.findById(n4.getId()).orElseThrow().isRead());
    }

    @Test
    void shouldDeleteOnlyReadAndOlderThanThreshold() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threshold = now.minusDays(30);

        Notification readAndOld = saveNotification(testUser1, true);
        ageNotificationInDatabase(readAndOld.getId(), now.minusDays(40));

        Notification readAndNew = saveNotification(testUser1, true);
        ageNotificationInDatabase(readAndNew.getId(), now.minusDays(10));

        Notification unreadAndOld = saveNotification(testUser1, false);
        ageNotificationInDatabase(unreadAndOld.getId(), now.minusDays(40));

        // When
        int deletedRecordsCount = notificationRepository.deleteReadAndOlderThan(threshold);

        // Then
        assertEquals(1, deletedRecordsCount);
        assertFalse(notificationRepository.existsById(readAndOld.getId()));
        assertTrue(notificationRepository.existsById(readAndNew.getId()));
        assertTrue(notificationRepository.existsById(unreadAndOld.getId()));
    }


    private Notification saveNotification(User recipient, boolean isRead) {
        return notificationRepository.saveAndFlush(Notification.builder()
                .recipient(recipient)
                .type(NotificationType.SYSTEM_NEW_EMPLOYEE)
                .message("Test")
                .isRead(isRead)
                .build());
    }

    private void ageNotificationInDatabase(UUID notificationId, LocalDateTime newDate) {
        jdbcTemplate.update("UPDATE notifications SET created_at = ? WHERE id = ?", newDate, notificationId);
    }
}