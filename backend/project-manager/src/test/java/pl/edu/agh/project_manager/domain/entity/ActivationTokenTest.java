package pl.edu.agh.project_manager.domain.entity;

import org.junit.jupiter.api.Test;
import pl.edu.agh.project_manager.domain.entity.user.ActivationToken;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class ActivationTokenTest {

    @Test
    void isExpired_ShouldReturnTrue_WhenReferenceTimeIsAfterExpiryDate() {
        // given
        LocalDateTime expiryDate = LocalDateTime.of(2024, 1, 1, 12, 0);

        var token = new ActivationToken();
        token.setExpiryDate(expiryDate);

        var referenceTime = expiryDate.plusDays(1);

        // when
        boolean result = token.isExpired(referenceTime);

        // then
        assertTrue(result, "Token should be expired when reference time is past expiry date");
    }

    @Test
    void isExpired_ShouldReturnFalse_WhenReferenceTimeIsBeforeExpiryDate() {
        // given
        LocalDateTime expiryDate = LocalDateTime.of(2024, 1, 10, 12, 0);

        var token = new ActivationToken();
        token.setExpiryDate(expiryDate);

        var referenceTime = expiryDate.minusMinutes(1);

        // when
        boolean result = token.isExpired(referenceTime);

        // then
        assertFalse(result, "Token should not be expired when reference time is before expiry date");
    }
}