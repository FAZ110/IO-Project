package pl.edu.agh.project_manager.service.projectgroup;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.project_group.AllGroupsResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.GroupOwnerResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.SingleGroupDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.GroupBasicResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.ProjectGroupResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.GroupType;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.repository.projectgroup.ProjectGroupRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;
import pl.edu.agh.project_manager.service.command.project.ProjectGroupCreationCommand;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.project.ProjectSpecification;
import org.springframework.data.jpa.domain.Specification;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectGroupsService {

    private final ProjectGroupRepository projectGroupRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public AllGroupsResponse getAllGroups(UserPrincipal userPrincipal) {
        Specification<Project> spec = ProjectSpecification.accessibleByUser(userPrincipal);

        List<Project> accessibleProjects = projectRepository.findAll(spec);

        List<ProjectResponse> unassigned = accessibleProjects.stream()
                .filter(p -> p.getProjectGroup() == null)
                .map(ProjectResponse::from)
                .collect(Collectors.toList());

        Map<ProjectGroup, List<Project>> groupedProjects = accessibleProjects.stream()
                .filter(p -> p.getProjectGroup() != null)
                .collect(Collectors.groupingBy(Project::getProjectGroup));

        List<ProjectGroupResponse> wallets = groupedProjects.entrySet().stream()
                .filter(entry -> entry.getKey().getGroupType() == GroupType.WALLET)
                .map(entry -> mapToGroupResponse(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        List<ProjectGroupResponse> programs = groupedProjects.entrySet().stream()
                .filter(entry -> entry.getKey().getGroupType() == GroupType.PROGRAM)
                .map(entry -> mapToGroupResponse(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return new AllGroupsResponse(wallets, programs, unassigned);
    }

    private ProjectGroupResponse mapToGroupResponse(ProjectGroup group, List<Project> projects) {
        List<ProjectResponse> projectDtos = projects.stream()
                .map(ProjectResponse::from)
                .collect(Collectors.toList());
        return new ProjectGroupResponse(group.getId(), group.getName(), projectDtos);
    }

    public List<GroupBasicResponse> getWalletGroups() {
        return getGroupsByType(GroupType.WALLET);
    }

    public List<GroupBasicResponse> getProgramGroups() {
        return getGroupsByType(GroupType.PROGRAM);
    }

    public SingleGroupDetailsResponse getGroupById(UUID id) {
        ProjectGroup projectGroup = projectGroupRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_GROUP_NOT_FOUND, "Cannot find project group with id: " + id));

        GroupOwnerResponse ownerResponse = new GroupOwnerResponse(
                projectGroup.getOwner().getName(),
                projectGroup.getOwner().getSurname(),
                projectGroup.getOwner().getEmail()
        );

        return new SingleGroupDetailsResponse(
                projectGroup.getId(),
                projectGroup.getName(),
                projectGroup.getDescription(),
                ownerResponse,
                projectGroup.getGroupType()
        );
    }

    @Transactional
    public UUID createGroup(ProjectGroupCreationCommand command) {
        User owner = userRepository.findById(command.ownerId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user with id: " + command.ownerId()));

        ProjectGroup projectGroup = buildProjectGroups(command, owner);

        ProjectGroup savedGroup = projectGroupRepository.save(projectGroup);
        addProjectToProjectGroup(command.projectIds(), projectGroup);

        return savedGroup.getId();
    }

    private List<GroupBasicResponse> getGroupsByType(GroupType groupType) {
        return projectGroupRepository.getSingleGroupByGroupType(groupType)
                .stream()
                .map(group -> new GroupBasicResponse(group.getId(), group.getName(), groupType))
                .toList();
    }

    private ProjectGroup buildProjectGroups(ProjectGroupCreationCommand command, User owner) {
        return ProjectGroup.builder()
                .name(command.name())
                .description(command.description())
                .groupType(command.groupType())
                .owner(owner)
                .build();
    }

    public ProjectGroup getProjectGroupOrThrow(UUID groupId) {
        return projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_GROUP_NOT_FOUND, "Cannot find group: " + groupId));
    }

    private void addProjectToProjectGroup(List<UUID> projectIds, ProjectGroup projectGroups) {
        List<Project> projects = projectRepository.findAllById(projectIds);

        if (projects.size() != projectIds.size()) {
            throw new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find all projects with provided ids");
        }

        projects.forEach(projectGroups::addProject);
    }
}
