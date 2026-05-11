package pl.edu.agh.project_manager.service.project;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.controller.dto.project.ProjectMembersResponse;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectRisk;
import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMilestone;
import pl.edu.agh.project_manager.domain.enums.GroupType;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.command.project.MilestoneCommand;
import pl.edu.agh.project_manager.service.command.project.ProjectCreationCommand;
import pl.edu.agh.project_manager.service.command.project.RiskCommand;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.service.command.project.SearchProjectCommand;
import pl.edu.agh.project_manager.service.projectgroup.ProjectGroupsService;
import pl.edu.agh.project_manager.service.user.UserService;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final UserService userService;
    private final ProjectGroupsService projectGroupService;
    private final ProjectRepository projectRepository;


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
                .where(ProjectSpecification.accessibleByUser(command.user()))
                .and(buildSearchFilter(command));

        return projectRepository.findAll(spec).stream()
                .map(ProjectResponse::from)
                .toList();
    }

    private Specification<Project> buildSearchFilter(SearchProjectCommand command) {
        Specification<Project> spec = (root, query, cb) -> cb.conjunction();

        if (command.query() != null && !command.query().isBlank()) {
            spec = spec.and(ProjectSpecification.withSearchPattern(command.query()));
        }

        if (command.groupId() != null) {
            spec = spec.and(ProjectSpecification.inGroup(command.groupId()));
        } else if (Boolean.TRUE.equals(command.unassignedOnly())) {
            spec = spec.and(ProjectSpecification.unassigned());
        }

        return spec;
    }
}
