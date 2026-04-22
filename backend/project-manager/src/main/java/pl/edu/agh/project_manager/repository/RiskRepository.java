package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.ProjectRisk;

import java.util.UUID;

public interface RiskRepository extends JpaRepository<ProjectRisk, UUID> {
}
