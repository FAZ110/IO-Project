package pl.edu.agh.project_manager.repository.user;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.entity.user.Qualification;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface QualificationRepository extends JpaRepository<Qualification, UUID> {
    @EntityGraph(attributePaths = {"skill"})
    List<Qualification> findAllByUser_Id(UUID userId);

    List<Qualification> findAllByUserSupervisorIdAndStatus(UUID supervisorId, QualificationStatus qualificationStatus);

    @Query("SELECT q FROM Qualification q " +
            "JOIN FETCH q.skill " +
            "WHERE q.user.id = :userId AND q.status = :status")
    List<Qualification> findAllByUserIdAndStatus(
            @Param("userId") UUID userId,
            @Param("status") QualificationStatus status
    );

    @Query("SELECT q FROM Qualification q " +
            "JOIN FETCH q.user u " +
            "JOIN FETCH q.skill s " +
            "WHERE q.id IN :ids AND u.supervisor.id = :managerId")
    List<Qualification> findAllByIdInAndUserSupervisorId(
            @Param("ids") Collection<UUID> ids,
            @Param("managerId") UUID managerId
    );
}