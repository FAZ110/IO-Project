package pl.edu.agh.project_manager.controller.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import pl.edu.agh.project_manager.service.command.project.RoleCommand;

import java.util.List;

public record ProjectRoleRequest(
        @NotBlank String name,
        @NotEmpty List<Integer> utilizationPercentages
) {
    public RoleCommand toCommand() {
        return new RoleCommand(name, utilizationPercentages);
    }
}
