package pl.edu.agh.project_manager.controller.dto.project_group;

// TODO: Brakuje id i Zamiast tego można używać UserBasicResponse, żeby modeele dto usera zostaly u usera
// Narazie zostawiam, żeby uniknac konfilkow
public record GroupOwnerResponse(
        String name,
        String surname,
        String email
) {
}
