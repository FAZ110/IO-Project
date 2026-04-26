package pl.edu.agh.project_manager.service.command.vacancy;

import java.util.UUID;

public record CreateVacancyCommand(
        UUID projectId,
        UUID roleId
) {}
