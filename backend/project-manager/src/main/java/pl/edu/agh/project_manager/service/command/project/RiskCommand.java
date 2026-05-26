package pl.edu.agh.project_manager.service.command.project;

public record RiskCommand(
        String name,
        String description,
        Integer probability,
        Integer impact
) {
}