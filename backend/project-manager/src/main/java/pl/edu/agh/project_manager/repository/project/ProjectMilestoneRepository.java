package pl.edu.agh.project_manager.repository.project;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMilestone;

import java.util.List;
import java.util.UUID;

public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, UUID> {
    List<ProjectMilestone> findAllByProjectIdOrderByDateAsc(UUID projectId);
}
