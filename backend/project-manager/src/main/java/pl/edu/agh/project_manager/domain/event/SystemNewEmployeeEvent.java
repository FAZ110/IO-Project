package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;

import java.util.UUID;

public record SystemNewEmployeeEvent(
        UUID employeeId,
        User recipient,
        String message
) implements NotificationEvent {

    @Override
    public UUID referenceId() {
        return employeeId;
    }

    @Override
    public NotificationType type() {
        return NotificationType.SYSTEM_NEW_EMPLOYEE;
    }
}