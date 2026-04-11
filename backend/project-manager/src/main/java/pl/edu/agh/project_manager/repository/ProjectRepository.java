package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.Project;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
}
