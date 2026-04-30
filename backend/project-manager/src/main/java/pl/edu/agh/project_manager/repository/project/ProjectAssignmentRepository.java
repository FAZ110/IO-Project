package pl.edu.agh.project_manager.repository.project;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;

import java.util.List;
import java.util.UUID;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, UUID> {
    List<ProjectAssignment> findAllByProjectIdOrderByStartDateAsc(UUID projectId);

    List<ProjectAssignment> findAllByUserSupervisorIdAndStatus(UUID supervisorId, AssignmentStatus status);

    List<ProjectAssignment> findAllByUserIdAndStatus(UUID userId, AssignmentStatus assignmentStatus);
}
