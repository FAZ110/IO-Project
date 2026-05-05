package pl.edu.agh.project_manager.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.project_group.AllGroupsResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.GroupOwnerResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.SingleGroupDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.SingleGroupResponse;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.ProjectGroups;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.GroupType;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectGroupsRepository;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.project.ProjectGroupCreationCommand;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ProjectGroupsService {

    private final ProjectGroupsRepository projectGroupsRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public AllGroupsResponse getAllGroups() {
        return new AllGroupsResponse(getWalletGroups(), getProgramGroups());
    }

    public List<SingleGroupResponse> getWalletGroups() {
        return getGroupsByType(GroupType.WALLET);
    }

    public List<SingleGroupResponse> getProgramGroups() {
        return getGroupsByType(GroupType.PROGRAM);
    }

    public SingleGroupDetailsResponse getGroupById(UUID id) {
        ProjectGroups projectGroups = projectGroupsRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_GROUP_NOT_FOUND, "Cannot find project group with id: " + id));

        GroupOwnerResponse ownerResponse = new GroupOwnerResponse(
                projectGroups.getOwner().getName(),
                projectGroups.getOwner().getSurname(),
                projectGroups.getOwner().getEmail()
        );

        return new SingleGroupDetailsResponse(
                projectGroups.getId(),
                projectGroups.getName(),
                projectGroups.getDescription(),
                ownerResponse,
                projectGroups.getGroupType()
        );
    }

    @Transactional
    public UUID createGroup(ProjectGroupCreationCommand command) {
        User owner = userRepository.findById(command.ownerId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user with id: " + command.ownerId()));

        ProjectGroups projectGroups = buildProjectGroups(command, owner);

        addProjectToProjectGroup(command.projectIds(), projectGroups);

        ProjectGroups savedGroup = projectGroupsRepository.save(projectGroups);

        return savedGroup.getId();
    }

    private List<SingleGroupResponse> getGroupsByType(GroupType groupType) {
        return projectGroupsRepository.getSingleGroupByGroupType(groupType)
                .stream()
                .map(group -> new SingleGroupResponse(group.getId(), group.getName()))
                .toList();
    }

    private ProjectGroups buildProjectGroups(ProjectGroupCreationCommand command, User owner) {
        return ProjectGroups.builder()
                .name(command.name())
                .description(command.description())
                .groupType(command.groupType())
                .owner(owner)
                .build();
    }

    private void addProjectToProjectGroup(List<UUID> projectIds, ProjectGroups projectGroups) {
        List<Project> projects = projectRepository.findAllById(projectIds);

        if (projects.size() != projectIds.size()) {
            throw new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND, "Cannot find all projects with provided ids");
        }

        projects.forEach(projectGroups::addProject);
    }
}
