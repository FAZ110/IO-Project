package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.ProjectRisk;

import java.util.List;
import java.util.UUID;

public interface RiskRepository extends JpaRepository<ProjectRisk, UUID> {
    public List<ProjectRisk> findAllByProjectId(UUID projectId);
}
