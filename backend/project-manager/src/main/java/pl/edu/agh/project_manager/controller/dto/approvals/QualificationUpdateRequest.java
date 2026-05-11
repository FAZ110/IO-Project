package pl.edu.agh.project_manager.controller.dto.approvals;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record QualificationUpdateRequest (
    @NotNull(message = "Identyfikator kwalifikacji jest wymagany")
    UUID qualificationId,

    @NotNull(message = "Akcja (ACCEPT/REJECT/EMPTY) jest wymagana")
    QualificationUpdateAction action
) {

}
