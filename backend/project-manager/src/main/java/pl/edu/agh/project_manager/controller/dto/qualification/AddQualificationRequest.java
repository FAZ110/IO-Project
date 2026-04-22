package pl.edu.agh.project_manager.controller.dto.qualification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AddQualificationRequest(
        @NotEmpty(message = "Lista umiejętności nie może być pusta")
        List<@NotBlank(message = "Nazwa umiejętności nie może być pusta") String> skillNames
) {}