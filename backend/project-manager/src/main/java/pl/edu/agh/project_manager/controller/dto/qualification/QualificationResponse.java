package pl.edu.agh.project_manager.controller.dto.qualification;

import pl.edu.agh.project_manager.domain.enums.QualificationStatus;

public record QualificationResponse(
        Long id,
        String name,
        QualificationStatus status
) {}