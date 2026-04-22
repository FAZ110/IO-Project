package pl.edu.agh.project_manager.controller.dto.project_group;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.domain.enums.GroupType;
import pl.edu.agh.project_manager.service.command.ProjectGroupCreationCommand;

import java.util.UUID;

public record ProjectGroupCreationRequest(
        @NotBlank(message = "Nazwa portfela/grupy nie może być pusta")
        String name,

        @NotBlank(message = "opis portfela/grupy nie może być pusta")
        String description,

        @NotNull(message = "Typ grupy nie może być pusty")
        GroupType groupType
) {

    public ProjectGroupCreationCommand toCommand(UUID ownerId) {
        return new ProjectGroupCreationCommand(
                this.name,
                this.description,
                this.groupType,
                ownerId
        );
    }
}
