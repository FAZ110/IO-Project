package pl.edu.agh.project_manager.controller.dto.qualification;

import pl.edu.agh.project_manager.domain.entity.user.Qualification;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;

import java.util.UUID;

public record QualificationResponse(
        UUID id,
        String name,
        QualificationStatus status
) {
    public static QualificationResponse from(Qualification qualification) {
        return new QualificationResponse(
                qualification.getId(),
                qualification.getSkill().getName(),
                qualification.getStatus()
        );
    }
}