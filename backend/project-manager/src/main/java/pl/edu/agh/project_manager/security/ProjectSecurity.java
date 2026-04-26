package pl.edu.agh.project_manager.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.repository.ProjectRepository;

import java.util.UUID;

@Component("projectSecurity")
@RequiredArgsConstructor
public class ProjectSecurity {

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