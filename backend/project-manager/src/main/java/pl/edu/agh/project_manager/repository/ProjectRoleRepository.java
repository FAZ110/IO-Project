package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.edu.agh.project_manager.domain.entity.ProjectRole;

import java.util.Optional;
import java.util.UUID;

public interface ProjectRoleRepository extends JpaRepository<ProjectRole, UUID> {

    @Query("SELECT pr FROM ProjectRole pr " +
            "JOIN FETCH pr.project p " +
            "JOIN FETCH p.projectManager " +
            "WHERE pr.id = :id")
    Optional<ProjectRole> findByIdWithProjectAndManager(@Param("id") UUID id);
}
