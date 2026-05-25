package pl.edu.agh.project_manager.controller.dto.project_risk;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Range;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;

public record ProjectRiskRequest(
        @NotBlank(message = "Nazwa ryzyka nie może być pusta!")
        String name,

        @NotBlank(message = "Opis ryzyka nie może być pusty!")
        String description,

        @NotNull(message = "Poziom prawdopodobieństwa jest wymagany!")
        @Range(min = 1, max = 5, message = "Prawdopodobieństwo musi być w skali 1-5!")
        Integer probability,

        @NotNull(message = "Poziom wpływu jest wymagany!")
        @Range(min = 1, max = 5, message = "Wpływ musi być w skali 1-5!")
        Integer impact
) {
    public RiskCommand toCommand() {
        return new RiskCommand(
                this.name,
                this.description,
                this.probability,
                this.impact
        );
    }
}