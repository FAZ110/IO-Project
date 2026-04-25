package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import pl.edu.agh.project_manager.domain.entity.Project;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Modifying
    @Query("UPDATE Project p SET p.projectManager = null WHERE p.projectManager.id = :managerId")
    void clearProjectManager(@Param("managerId") UUID managerId);

    @Query("SELECT p FROM Project p JOIN FETCH p.projectManager WHERE p.id = :id")
    Optional<Project> findByIdWithManager(@Param("id") UUID id);

    boolean existsByIdAndProjectManagerId(UUID id, UUID projectManagerId);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Project p JOIN p.members m WHERE p.id = :projectId AND m.user.id = :userId")
    boolean isUserMemberOfProject(@Param("projectId") UUID projectId, @Param("userId") UUID userId);
}
