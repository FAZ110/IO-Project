package pl.edu.agh.project_manager.controller.dto.qualification;

import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

public record AddQualificationRequest(
        List<@NotBlank(message = "Nazwa umiejętności nie może być pusta") String> skillNames,
        List<UUID> skillIds
) {}