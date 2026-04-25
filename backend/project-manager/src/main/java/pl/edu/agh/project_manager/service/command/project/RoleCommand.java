package pl.edu.agh.project_manager.service.command.project;

import java.util.List;

public record RoleCommand(
        String name,
        List<Integer> utilizationPercentages
) {
}
