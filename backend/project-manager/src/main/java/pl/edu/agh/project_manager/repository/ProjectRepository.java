package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.edu.agh.project_manager.domain.entity.Project;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Modifying
    @Query("UPDATE Project p SET p.projectManager = null WHERE p.projectManager.id = :managerId")
    void clearProjectManager(@Param("managerId") UUID managerId);
}
