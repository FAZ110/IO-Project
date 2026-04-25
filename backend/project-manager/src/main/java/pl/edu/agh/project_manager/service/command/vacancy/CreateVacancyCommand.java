package pl.edu.agh.project_manager.service.command.vacancy;

import java.time.LocalDate;
import java.util.UUID;

public record CreateVacancyCommand(
        UUID projectId,
        UUID roleId,
        LocalDate startDate,
        LocalDate endDate
) {}
