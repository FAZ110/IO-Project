package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.NotificationType;

import java.util.UUID;

public record AssignmentRejectedEvent(
        UUID assignmentId,
        User recipient,
        String employeeName,
        String projectName
) implements NotificationEvent {

    @Override
    public UUID referenceId() {
        return assignmentId;
    }

    @Override
    public NotificationType type() {
        return NotificationType.ASSIGNMENT_REJECTED;
    }

    @Override
    public String buildMessage() {
        return "Odrzucono przypisanie pracownika " + employeeName + " do projektu " + projectName;
    }
}