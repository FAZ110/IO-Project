package pl.edu.agh.project_manager.controller.dto.vacancy;

import pl.edu.agh.project_manager.domain.entity.Vacancy;
import pl.edu.agh.project_manager.domain.enums.VacancyStatus;

import java.util.UUID;

public record VacancyResponse(
        UUID id,
        UUID projectId,
        UUID roleId,
        String roleName,
        VacancyStatus status
) {
    public static VacancyResponse from(Vacancy vacancy) {
        return new VacancyResponse(
                vacancy.getId(),
                vacancy.getProject().getId(),
                vacancy.getProjectRole().getId(),
                vacancy.getProjectRole().getRoleName(),
                vacancy.getStatus()
        );
    }
}
