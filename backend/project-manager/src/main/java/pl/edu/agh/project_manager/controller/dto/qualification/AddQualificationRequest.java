package pl.edu.agh.project_manager.controller.dto.qualification;

import jakarta.validation.constraints.NotBlank;

public record AddQualificationRequest(
        @NotBlank(message = "Nazwa umiejętności nie może być pusta")
        String name
) {}