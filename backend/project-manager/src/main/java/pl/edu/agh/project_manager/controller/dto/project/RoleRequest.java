package pl.edu.agh.project_manager.controller.dto.project;

import pl.edu.agh.project_manager.service.command.project.RoleCommand;

import java.util.List;

public record RoleRequest(
        String name,
        List<Integer> utilizationPercentages
) {

    public RoleCommand toCommand() {
        return new RoleCommand(
                name,
                utilizationPercentages
        );
    }
}
