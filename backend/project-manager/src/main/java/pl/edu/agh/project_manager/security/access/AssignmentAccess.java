package pl.edu.agh.project_manager.security.access;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.repository.project.ProjectAssignmentRepository;
import pl.edu.agh.project_manager.security.UserPrincipal;
import java.util.UUID;

@Component("assignmentAccess")
@RequiredArgsConstructor
public class AssignmentAccess {

    private final ProjectAssignmentRepository assignmentRepository;

    public boolean canManageAssignment(UUID assignmentId, UserPrincipal principal) {
        if (principal == null) {
            return false;
        }

        return assignmentRepository.isManagerForAssignment(assignmentId, principal.userId());
    }
}