package pl.edu.agh.project_manager.controller.dto.qualification;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;

import java.util.UUID;

public record QualificationResponse(
        UUID id,
        String name,
        QualificationStatus status
) {}