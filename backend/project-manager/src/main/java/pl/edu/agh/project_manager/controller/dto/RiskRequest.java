package pl.edu.agh.project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Range;
import pl.edu.agh.project_manager.domain.entity.Risk;
import pl.edu.agh.project_manager.service.command.RiskCommand;

public record RiskRequest(
        @NotBlank(message = "Nazwa ryzyka nie może być pusta!")
        String name,

        @NotBlank(message = "Opis ryzyka nie może być pusty!")
        String description,

        @NotNull(message = "Poziom prawdopodobieństwa jest wymagany!")
        @Range(min = 0, max = 100, message = "Prawdopodobieństwo musi być w skali 0-100%!")
        Integer probability
) {
    public RiskCommand toCommand() {
        return new RiskCommand(
                this.name,
                this.description,
                this.probability
        );
    }
}
