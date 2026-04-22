package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.Skill;

import java.util.Optional;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {
    Optional<Skill> findByNameIgnoreCase(String name);
}