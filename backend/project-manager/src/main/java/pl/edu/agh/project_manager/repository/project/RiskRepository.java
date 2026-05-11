package pl.edu.agh.project_manager.repository.project;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.project.ProjectRisk;

import java.util.List;
import java.util.UUID;

public interface RiskRepository extends JpaRepository<ProjectRisk, UUID> {
    List<ProjectRisk> findAllByProjectId(UUID projectId);
}
