package pl.edu.agh.project_manager.repository.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;

import java.util.List;
import java.util.UUID;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, UUID> {
    List<ProjectAssignment> findAllByProjectIdOrderByStartDateAsc(UUID projectId);

    List<ProjectAssignment> findAllByUserSupervisorIdAndStatus(UUID supervisorId, AssignmentStatus status);

    List<ProjectAssignment> findAllByUserIdAndStatus(UUID userId, AssignmentStatus assignmentStatus);

    @Query("SELECT CASE WHEN COUNT(pa) > 0 THEN true ELSE false END " +
            "FROM ProjectAssignment pa " +
            "JOIN pa.user u " +
            "WHERE pa.id = :assignmentId AND u.supervisor.id = :managerId")
    boolean isManagerForAssignment(@Param("assignmentId") UUID assignmentId, @Param("managerId") UUID managerId);

    @Query("SELECT pa FROM ProjectAssignment pa " +
            "JOIN FETCH pa.user u " +
            "WHERE pa.project.id = :projectId " +
            "AND pa.status IN ('PENDING', 'ACCEPTED') " +
            "ORDER BY pa.createdAt ASC")
    List<ProjectAssignment> findByProjectIdOrderByCreatedAtAsc(@Param("projectId") UUID projectId);
}
