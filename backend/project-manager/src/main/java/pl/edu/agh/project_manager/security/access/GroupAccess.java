package pl.edu.agh.project_manager.security.access;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.repository.projectgroup.ProjectGroupRepository;
import pl.edu.agh.project_manager.security.UserPrincipal;

import java.util.UUID;

@Component("groupAccess")
@RequiredArgsConstructor
public class GroupAccess {

    private final ProjectGroupRepository projectGroupRepository;
    private final ProjectAccess projectAccess;

    public boolean canAccessGroup(UUID groupId, UserPrincipal currentUser) {
        if (currentUser == null) {
            return false;
        }

        return projectGroupRepository.findById(groupId)
                .map(group -> {
                    if (group.getOwner().getId().equals(currentUser.userId())) {
                        return true;
                    }

                    return group.getProjects().stream()
                            .anyMatch(project -> projectAccess.canAccessProject(project.getId(), currentUser));
                })
                .orElse(false);
    }
}