package pl.edu.agh.project_manager.controller.dto.milestone;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMilestone;

import java.time.LocalDate;
import java.util.UUID;

public record MilestoneResponse (
        UUID id,

        String name,

        String description,

        LocalDate date
) {
    public static MilestoneResponse from(ProjectMilestone milestone) {
        return new MilestoneResponse(
                milestone.getId(),
                milestone.getName(),
                milestone.getDescription(),
                milestone.getDate()
        );
    }
}
