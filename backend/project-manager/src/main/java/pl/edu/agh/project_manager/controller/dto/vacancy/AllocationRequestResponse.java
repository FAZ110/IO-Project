package pl.edu.agh.project_manager.controller.dto.vacancy;

import pl.edu.agh.project_manager.domain.entity.AllocationRequest;
import pl.edu.agh.project_manager.domain.enums.AllocationRequestStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AllocationRequestResponse(
        UUID id,
        UUID vacancyId,
        UUID requestedEmployeeId,
        UUID createdById,
        String justification,
        AllocationRequestStatus status,
        LocalDateTime createdAt
) {
    public static AllocationRequestResponse from(AllocationRequest request) {
        return new AllocationRequestResponse(
                request.getId(),
                request.getVacancy().getId(),
                request.getRequestedEmployee() != null ? request.getRequestedEmployee().getId() : null,
                request.getCreatedBy().getId(),
                request.getJustification(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }
}
