package pl.edu.agh.project_manager.controller.dto.approvals;

import pl.edu.agh.project_manager.domain.entity.user.Qualification;

import java.util.UUID;

public record QualificationDetailsResponse(
        UUID qualificationId,
        String qualificationName
) {
    public static QualificationDetailsResponse from(Qualification qualification) {
        return new QualificationDetailsResponse(
                qualification.getId(),
                qualification.getSkill().getName()
        );
    }
}
