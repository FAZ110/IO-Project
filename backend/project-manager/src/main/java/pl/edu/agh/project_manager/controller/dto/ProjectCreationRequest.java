package pl.edu.agh.project_manager.controller.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record ProjectCreationRequest(
        @NotBlank(message = "Tytuł projektu nie może być pusty!")
        String title,

        @NotBlank(message = "Opis projektu nie może być pusty!")
        String description,

        @NotNull(message = "Data początkowa nie może być pusta!")
        @FutureOrPresent(message = "Data początkowa musi być z przyszłości!")
        LocalDate startDate,

        @NotNull(message = "Aktywność projektu nie może być pusta!")
        Boolean isActive,

        Integer walletId,
        Integer programId,

        @Valid
        List<RiskRequest> risks
) {
    // Domyślnie projekt jest aktywny i lista jest pusta
    public ProjectCreationRequest {
        if (isActive == null) isActive = true;

        if (risks.isEmpty()) risks = List.of();
    }
}
