package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.vacancy.AllocationRequestResponse;
import pl.edu.agh.project_manager.controller.dto.vacancy.CreateAllocationRequest;
import pl.edu.agh.project_manager.controller.dto.vacancy.CreateVacancyRequest;
import pl.edu.agh.project_manager.controller.dto.vacancy.VacancyResponse;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.VacancyService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class VacancyController {

    private final VacancyService vacancyService;

    @GetMapping("/project/{projectId}/vacancies")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectSecurity.canAccessProject(#projectId, authentication.principal)")
    public ResponseEntity<List<VacancyResponse>> getVacancies(
            @PathVariable UUID projectId
    ) {
        List<VacancyResponse> vacancies = vacancyService.getVacanciesByProjectId(projectId);
        return ResponseEntity.ok(vacancies);
    }

    @PostMapping("/project/{projectId}/vacancies")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<VacancyResponse> createVacancy(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateVacancyRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        VacancyResponse createdVacancy = vacancyService.createVacancy(
                request.toCommand(projectId),
                userPrincipal.userId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVacancy);
    }

    @PostMapping("/vacancies/{vacancyId}/allocation-requests")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<AllocationRequestResponse> createAllocationRequest(
            @PathVariable UUID vacancyId,
            @Valid @RequestBody CreateAllocationRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        AllocationRequestResponse createdRequest = vacancyService.createAllocationRequest(
                request.toCommand(vacancyId, userPrincipal.userId())
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }
}
