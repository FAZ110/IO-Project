package pl.edu.agh.project_manager.service.project;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.milestone.MilestoneResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMilestone;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.repository.project.ProjectMilestoneRepository;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectMilestoneService {

    private final ProjectRepository projectRepository;
    private final ProjectMilestoneRepository milestoneRepository;

    public List<MilestoneResponse> getProjectMilestones(UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find project: " + projectId);
        }

        return milestoneRepository.findAllByProjectIdOrderByDateAsc(projectId)
                .stream()
                .map(MilestoneResponse::from)
                .toList();
    }

    @Transactional
    public MilestoneResponse createMilestone(UUID projectId, MilestoneCommand command) {
        Project project = getProject(projectId);

        validateMilestoneDate(command.date(), project);

        ProjectMilestone milestone = ProjectMilestone.builder()
                .project(project)
                .name(command.name())
                .description(command.description())
                .date(command.date())
                .build();

        ProjectMilestone savedMilestone = milestoneRepository.save(milestone);
        project.addMilestone(savedMilestone);

        return MilestoneResponse.from(savedMilestone);
    }

    @Transactional
    public MilestoneResponse updateMilestone(UUID projectId, UUID milestoneId, MilestoneCommand command) {
        Project project = getProject(projectId);
        ProjectMilestone milestone = getMilestoneForProject(projectId, milestoneId);

        if (command.date() != null) {
            validateMilestoneDate(command.date(), project);
            milestone.setDate(command.date());
        }

        if (command.name() != null) {
            milestone.setName(command.name());
        }

        if (command.description() != null) {
            milestone.setDescription(command.description());
        }

        return MilestoneResponse.from(milestone);
    }

    @Transactional
    public void deleteMilestone(UUID projectId, UUID milestoneId) {
        ProjectMilestone milestone = getMilestoneForProject(projectId, milestoneId);
        milestoneRepository.delete(milestone);
    }


    private Project getProject(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find project: " + projectId));
    }

    private ProjectMilestone getMilestoneForProject(UUID projectId, UUID milestoneId) {
        ProjectMilestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.MILESTONE_NOT_FOUND, "Cannot find milestone: " + milestoneId));

        if (!milestone.getProject().getId().equals(projectId)) {
            throw new ApplicationException(ApiErrorCode.MILESTONE_NOT_FOUND, "Milestone does not belong to this project");
        }

        return milestone;
    }

    private void validateMilestoneDate(LocalDate milestoneDate, Project project) {
        if (milestoneDate.isBefore(project.getStartDate()) || milestoneDate.isAfter(project.getEndDate())) {
            throw new ApplicationException(
                    ApiErrorCode.INVALID_MILESTONE_DATE,
                    "Milestone date must be between project start and end dates"
            );
        }
    }
}