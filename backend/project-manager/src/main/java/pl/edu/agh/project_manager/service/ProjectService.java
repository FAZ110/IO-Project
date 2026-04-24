package pl.edu.agh.project_manager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.controller.dto.RiskResponse;
import pl.edu.agh.project_manager.domain.entity.*;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectGroupsRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.RiskRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;
import pl.edu.agh.project_manager.service.command.project.RoleCommand;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private static final int MINIMUM_MILESTONES = 2;

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final RiskRepository riskRepository;
    private final ProjectGroupsRepository projectGroupRepository;

    @Transactional
    public UUID createProject(ProjectCreationCommand command) {
        User projectManager = userRepository.findById(command.creatorId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_MANAGER_NOT_FOUND, "Cannot find provided project manager - " + command.creatorId()));

        ProjectGroups projectGroup = null;
        if (command.projectGroupId() != null) {
            projectGroup = projectGroupRepository.findById(command.projectGroupId())
                    .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_GROUP_NOT_FOUND, "Cannot find provided project group - " + command.projectGroupId()));
        }

        Project project = buildProject(command, projectManager);
        project.setProjectGroup(projectGroup);

        addRisksToProject(project, command.risks());

        List<ProjectSegment> segments = createSegmentsFromMilestones(command.milestones());
        for (ProjectSegment segment : segments) {
            project.addSegment(segment);
        }
        addRolesAndBindWithSegments(project, segments, command.roles());

        Project savedProject = projectRepository.save(project);

        return savedProject.getId();
    }

    private void addRolesAndBindWithSegments(Project project, List<ProjectSegment> segments, List<RoleCommand> roles) {
        for (RoleCommand role : roles) {
            if (role.utilizationPercentages().size() != segments.size()) {
                throw new ApplicationException(ApiErrorCode.INVALID_ROLE_UTILIZATION, "Role " + role.name() + " has invalid number of utilization percentages - expected: " + segments.size() + ", actual: " + role.utilizationPercentages().size());
            }

            ProjectRole projectRole = ProjectRole
                    .builder()
                    .roleName(role.name())
                    .build();

            for (int i = 0; i < segments.size(); i++) {
                ProjectSegment currentSegment = segments.get(i);
                int percentage = role.utilizationPercentages().get(i);

                ProjectRoleSegmentAllocation segmentAllocation = ProjectRoleSegmentAllocation
                        .builder()
                        .projectRole(projectRole)
                        .segment(currentSegment)
                        .utilizationPercentage(percentage)
                        .build();

                projectRole.addSegmentAllocation(segmentAllocation);
            }

            project.addRole(projectRole);
        }
    }

    private List<ProjectSegment> createSegmentsFromMilestones(List<MilestoneCommand> milestones) {
        if (milestones.size() < MINIMUM_MILESTONES) {
            throw new ApplicationException(ApiErrorCode.INVALID_MILESTONES);
        }

        List<ProjectSegment> segments = new ArrayList<>();

        for (int i = 1; i < milestones.size(); i++) {
            MilestoneCommand endMilestone = milestones.get(i);
            LocalDate startDate = milestones.get(i - 1).date();
            LocalDate endDate = endMilestone.date();

            if (!endDate.isAfter(startDate)) {
                throw new ApplicationException(ApiErrorCode.INVALID_MILESTONE_ORDER);
            }

            ProjectSegment segment = ProjectSegment.builder()
                    .startDate(startDate)
                    .endDate(endDate)
                    .label(endMilestone.name())
                    .build();

            segments.add(segment);
        }

        return segments;
    }

    @Transactional
    public void deleteProjectRisk(UUID projectId, UUID riskId, UUID projectManagerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find provided project - " + projectId));

        if (!project.getProjectManager().getId().equals(projectManagerId)) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "Only project manager can delete project");
        }

        ProjectRisk removedRisk = project.getRisks().stream()
                .filter(risk -> risk.getId().equals(riskId))
                .findFirst()
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.RISK_NOT_FOUND, "Cannot find provided risk - " + riskId));

        project.removeRisk(removedRisk);
    }

    @Transactional
    public RiskResponse updateProjectRisk(UUID projectId, UUID riskId, UUID projectManagerId, RiskCommand command) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find provided project - " + projectId));

        if (!project.getProjectManager().getId().equals(projectManagerId)) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "Only project manager can update project risks");
        }

        ProjectRisk risk = project.getRisks()
                .stream()
                .filter(r -> r.getId().equals(riskId))
                .findFirst()
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.RISK_NOT_FOUND, "Cannot found provided risk - " + riskId));

        if (command.name() != null) {
            risk.setName(command.name());
        }
        if (command.description() != null) {
            risk.setDescription(command.description());
        }
        if (command.probability() != null) {
            risk.setProbability(command.probability());
        }

        return new RiskResponse(
                risk.getId(),
                risk.getName(),
                risk.getDescription(),
                risk.getProbability()
        );
    }

    @Transactional
    public RiskResponse createProjectRisk(RiskCommand command,  UUID projectManagerId, UUID projectId) {
        User projectManager = userRepository.findById(projectManagerId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_MANAGER_NOT_FOUND, "Cannot find provided project manager - " + projectManagerId));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find provided project - " + projectId));

        ProjectRisk risk = buildRisk(command, projectManager);
        project.addRisk(risk);

        ProjectRisk savedRisk = riskRepository.save(risk);

        return new RiskResponse(
                savedRisk.getId(),
                savedRisk.getName(),
                savedRisk.getDescription(),
                savedRisk.getProbability()
        );
    }

    private Project buildProject(ProjectCreationCommand command, User projectManager) {
        return Project.builder()
                .title(command.title())
                .description(command.description())
                .projectManager(projectManager)
                .startDate(command.startDate())
                .isActive(command.isActive())
                .build();
    }

    private ProjectRisk buildRisk(RiskCommand command, User projectManager) {
        return ProjectRisk.builder()
                .name(command.name())
                .description(command.description())
                .probability(command.probability())
                .build();
    }

    private void addRisksToProject(Project project, List<RiskCommand> risks) {
        if (risks == null) return;

        risks.forEach(riskRequest -> {
            ProjectRisk risk = ProjectRisk.builder()
                    .name(riskRequest.name())
                    .description(riskRequest.description())
                    .probability(riskRequest.probability())
                    .build();

            project.addRisk(risk);
        });
    }
}
