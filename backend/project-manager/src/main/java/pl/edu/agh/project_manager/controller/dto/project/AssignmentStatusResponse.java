package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;

public enum AssignmentStatusResponse {
    PENDING,
    ACCEPTED,
    REJECTED;

    public static AssignmentStatusResponse from(AssignmentStatus status) {
        return switch (status) {
            case PENDING -> PENDING;
            case ACCEPTED -> ACCEPTED;
            case REJECTED -> REJECTED;
        };
    }
}
