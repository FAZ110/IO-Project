package pl.edu.agh.project_manager.controller.dto;

import java.util.UUID;

public record SingleGroupResponse (
        UUID id,
        String name
) {
}
