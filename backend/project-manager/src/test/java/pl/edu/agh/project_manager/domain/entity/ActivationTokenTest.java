package pl.edu.agh.project_manager.domain.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class ActivationTokenTest {

    @Test
    void isExpired_ShouldReturnTrue_WhenReferenceTimeIsAfterExpiryDate() {
        // given
        var token = new ActivationToken();
        token.setExpiryDate(LocalDateTime.of(2024, 1, 1, 12, 0));

        var referenceTime = LocalDateTime.of(2024, 1, 2, 12, 0); // Dzień później

        // when
        boolean result = token.isExpired(referenceTime);

        // then
        assertTrue(result, "Token should be expired when reference time is past expiry date");
    }

    @Test
    void isExpired_ShouldReturnFalse_WhenReferenceTimeIsBeforeExpiryDate() {
        // given
        var token = new ActivationToken();
        token.setExpiryDate(LocalDateTime.of(2024, 1, 10, 12, 0));

        var referenceTime = LocalDateTime.of(2024, 1, 1, 12, 0); // 9 dni wcześniej

        // when
        boolean result = token.isExpired(referenceTime);

        // then
        assertFalse(result, "Token should not be expired when reference time is before expiry date");
    }
}