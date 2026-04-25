package pl.edu.agh.project_manager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.controller.dto.vacancy.AllocationRequestResponse;
import pl.edu.agh.project_manager.controller.dto.vacancy.VacancyResponse;
import pl.edu.agh.project_manager.domain.entity.AllocationRequest;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectRole;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.entity.Vacancy;
import pl.edu.agh.project_manager.domain.enums.AllocationRequestStatus;
import pl.edu.agh.project_manager.domain.enums.VacancyStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.AllocationRequestRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.repository.VacancyRepository;
import pl.edu.agh.project_manager.service.command.vacancy.CreateAllocationRequestCommand;
import pl.edu.agh.project_manager.service.command.vacancy.CreateVacancyCommand;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacancyService {

    private final VacancyRepository vacancyRepository;
    private final AllocationRequestRepository allocationRequestRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<VacancyResponse> getVacanciesByProjectId(UUID projectId) {
        return vacancyRepository.findByProjectId(projectId).stream()
                .map(VacancyResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public VacancyResponse createVacancy(CreateVacancyCommand command, UUID userId) {
        Project project = projectRepository.findById(command.projectId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND));

        if (!project.getProjectManager().getId().equals(userId)) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "Only project manager can create a vacancy");
        }

        ProjectRole role = project.getRoles().stream()
                .filter(r -> r.getId().equals(command.roleId()))
                .findFirst()
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.ROLE_NOT_FOUND));

        Vacancy vacancy = Vacancy.builder()
                .project(project)
                .projectRole(role)
                .startDate(command.startDate())
                .endDate(command.endDate())
                .status(VacancyStatus.OPEN)
                .build();

        project.addVacancy(vacancy);
        Vacancy savedVacancy = vacancyRepository.save(vacancy);

        return VacancyResponse.from(savedVacancy);
    }

    @Transactional
    public AllocationRequestResponse createAllocationRequest(CreateAllocationRequestCommand command) {
        Vacancy vacancy = vacancyRepository.findById(command.vacancyId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.VACANCY_NOT_FOUND));

        if (vacancy.getStatus() != VacancyStatus.OPEN) {
            throw new ApplicationException(ApiErrorCode.INVALID_VACANCY_STATUS, "Vacancy is not open for requests");
        }

        User creator = userRepository.findById(command.createdById())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        if (!vacancy.getProject().getProjectManager().getId().equals(creator.getId())) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "Only project manager can create an allocation request");
        }

        User requestedEmployee = null;
        if (command.requestedEmployeeId() != null) {
            requestedEmployee = userRepository.findById(command.requestedEmployeeId())
                    .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Requested employee not found"));
        }

        AllocationRequest request = AllocationRequest.builder()
                .vacancy(vacancy)
                .requestedEmployee(requestedEmployee)
                .createdBy(creator)
                .justification(command.justification())
                .status(AllocationRequestStatus.SUBMITTED)
                .build();

        vacancy.addAllocationRequest(request);
        vacancy.setStatus(VacancyStatus.PENDING_REQUEST);

        AllocationRequest savedRequest = allocationRequestRepository.save(request);

        return AllocationRequestResponse.from(savedRequest);
    }
}
