package pl.edu.agh.project_manager.repository.user;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.user.Qualification;

import java.util.List;
import java.util.UUID;

public interface QualificationRepository extends JpaRepository<Qualification, UUID> {
    @EntityGraph(attributePaths = {"skill"})
    List<Qualification> findAllByUser_Id(UUID userId);
}