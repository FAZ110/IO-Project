package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;

import java.util.UUID;

public record AssignmentAcceptedEvent(
        UUID assignmentId,
        User recipient,
        String projectName,
        String employeeFullName
) implements NotificationEvent {

    @Override
    public UUID referenceId() {
        return assignmentId;
    }

    @Override
    public NotificationType type() {
        return NotificationType.ASSIGNMENT_ACCEPTED;
    }

    @Override
    public String buildMessage() {
        if (employeeFullName != null) {
            return "Zaakceptowano przypisanie pracownika " + employeeFullName + " do projektu " + projectName;
        }
        return "Zostałeś dodany do projektu: " + projectName;
    }
}