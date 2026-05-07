package pl.edu.agh.project_manager.domain.event;

import pl.edu.agh.project_manager.domain.entity.user.User;

import java.util.UUID;

public record AssignmentAcceptedEvent(
        UUID assignmentId,
        User recipient, String
        message
) {}