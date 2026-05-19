package pl.edu.agh.project_manager.service.project;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.milestone.MilestoneResponse;
import pl.edu.agh.project_manager.controller.dto.project.*;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.entity.project.ProjectRisk;
import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMilestone;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectAssignmentRepository;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import pl.edu.agh.project_manager.service.command.project.SearchProjectCommand;
import pl.edu.agh.project_manager.service.projectgroup.ProjectGroupsService;
import pl.edu.agh.project_manager.service.user.UserService;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final UserService userService;
    private final ProjectGroupsService projectGroupService;
    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository assignmentRepository;


    @Transactional
    public UUID createProject(ProjectCreationCommand command) {
        User projectManager = userService.getUserEntityOrThrow(command.creatorId());

        ProjectGroup projectGroup = null;
        if (command.projectGroupId() != null) {
            projectGroup = projectGroupService.getProjectGroupOrThrow(command.projectGroupId());
        }

        Project project = buildProject(command, projectManager);
        project.setProjectGroup(projectGroup);

        addRisksToProject(project, command.risks());
        addMilestonesToProject(project, command.milestones());

        addSponsorsToProject(project, command.sponsors());
        addCommitteesToProject(project, command.committee());

        Project savedProject = projectRepository.save(project);

        return savedProject.getId();
    }

    @Transactional
    public ProjectResponse getProject(UUID projectId) {
        Project project = projectRepository.findByIdWithManager(projectId)
                .orElseThrow(() -> new ApplicationException(
                        ApiErrorCode.PROJECT_NOT_FOUND,
                        "Cannot find provided project - " + projectId
                ));

        return ProjectResponse.from(project);
    }

    public ProjectMembersResponse getProjectMembers(UUID projectId) {
        Project project = projectRepository.findByIdWithAllMembers(projectId)
                .orElseThrow(() -> new ApplicationException(
                        ApiErrorCode.PROJECT_NOT_FOUND,
                        "Cannot find provided project - " + projectId
                ));

        return ProjectMembersResponse.from(project);
    }

    @Transactional(readOnly = true)
    public ProjectTimelineResponse getTimelineData(UUID projectId) {
        Project project = projectRepository.findWithMilestonesById(projectId)
                .orElseThrow(() -> new ApplicationException(
                        ApiErrorCode.PROJECT_NOT_FOUND,
                        "Cannot find provided project - " + projectId
                ));

        List<ProjectAssignment> assignments = assignmentRepository.findByProjectIdOrderByCreatedAtAsc(projectId);

        return new ProjectTimelineResponse(
                project.getMilestones().stream().map(MilestoneResponse::from).toList(),
                groupAssignmentsByEmployee(assignments)
        );
    }

    private List<AssignmentsByEmployeeResponse> groupAssignmentsByEmployee(List<ProjectAssignment> assignments) {
        Map<User, List<ProjectAssignment>> assignmentsByUser = assignments.stream()
                .collect(Collectors.groupingBy(ProjectAssignment::getUser, LinkedHashMap::new, Collectors.toList()));

        return assignmentsByUser.entrySet().stream()
                .map(entry -> {
                    User employee = entry.getKey();
                    List<ProjectAssignment> userAssignments = entry.getValue();

                    return new AssignmentsByEmployeeResponse(
                            employee.getId(),
                            employee.getName(),
                            employee.getSurname(),
                            employee.getEmail(),
                            userAssignments.stream()
                                    .map(ProjectAssignmentResponse::from)
                                    .toList()
                    );
                })
                .toList();
    }

    private Project buildProject(ProjectCreationCommand command, User projectManager) {
        return Project.builder()
                .title(command.title())
                .description(command.description())
                .projectManager(projectManager)
                .startDate(command.startDate())
                .endDate(command.endDate())
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

    private void addMilestonesToProject(Project project, List<MilestoneCommand> milestones) {
        if (milestones == null) return;

        milestones.forEach(milestoneRequest -> {
            ProjectMilestone milestone = ProjectMilestone.builder()
                    .name(milestoneRequest.name())
                    .description(milestoneRequest.description())
                    .date(milestoneRequest.date())
                    .build();

            project.addMilestone(milestone);
        });
    }

    private void addSponsorsToProject(Project project, List<UUID> sponsors) {
        List<User> sponsorUsers = userService.getUsersByIdsOrThrow(sponsors, "Cannot find one or more provided sponsors");

        sponsorUsers.forEach(project::addSponsor);
    }

    private void addCommitteesToProject(Project project, List<UUID> committee) {
        List<User> committeeUsers = userService.getUsersByIdsOrThrow(committee, "Cannot find one or more provided committee members");

        committeeUsers.forEach(project::addCommittee);
    }

    public void checkProjectExistsOrThrow(UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find project: " + projectId);
        }
    }

    public Project getProjectEntityOrThrow(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find project: " + projectId));
    }

    @Transactional
    public List<ProjectResponse> searchProjects(SearchProjectCommand command) {
        Specification<Project> spec = Specification
                .where(buildSearchFilter(command));

        return projectRepository.findAll(spec).stream()
                .map(ProjectResponse::from)
                .toList();
    }

    private Specification<Project> buildSearchFilter(SearchProjectCommand command) {
        Specification<Project> spec = (root, query, cb) -> cb.conjunction();

        if (command.query() != null && !command.query().isBlank()) {
            spec = spec.and(ProjectSpecification.withSearchPattern(command.query()));
        }

        if (command.isActive() != null) {
            spec = spec.and(ProjectSpecification.isActive(command.isActive()));
        }

        if (command.groupId() != null) {
            spec = spec.and(ProjectSpecification.inGroup(command.groupId()));
        } else if (Boolean.TRUE.equals(command.unassignedOnly())) {
            spec = spec.and(ProjectSpecification.unassigned());
        }

        return spec;
    }
}
