package pl.edu.agh.project_manager.controller.dto.approvals;


import java.util.UUID;

public record QualificationRequestResponse(
        UUID userId,
        String employeeName,
        String employeeSurname,
        int qualificationsCount
) {
}
