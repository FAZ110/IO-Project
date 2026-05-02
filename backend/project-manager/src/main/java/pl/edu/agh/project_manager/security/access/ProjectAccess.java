package pl.edu.agh.project_manager.security.access;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.security.UserPrincipal;

import java.util.UUID;

@Component("projectAccess")
@RequiredArgsConstructor
public class ProjectAccess {

    private final ProjectRepository projectRepository;

    public boolean canAccessProject(UUID projectId, UserPrincipal currentUser) {
        if (currentUser == null) {
            return false;
        }

        UUID userId = currentUser.userId();

        boolean isManager = projectRepository.existsByIdAndProjectManagerId(projectId, userId);
        if (isManager) {
            return true;
        }

        boolean isMember = projectRepository.isUserMemberOfProject(projectId, userId);

        return isMember;
    }

    public boolean isProjectManagerForProject(UUID projectId, UserPrincipal currentUser) {
        if (currentUser == null) {
            return false;
        }

        UUID userId = currentUser.userId();

        return projectRepository.existsByIdAndProjectManagerId(projectId, userId);
    }
}
