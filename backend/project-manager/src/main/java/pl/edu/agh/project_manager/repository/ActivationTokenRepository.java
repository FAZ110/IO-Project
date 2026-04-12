package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import pl.edu.agh.project_manager.domain.entity.ActivationToken;

import java.util.UUID;

public interface ActivationTokenRepository extends JpaRepository<ActivationToken, UUID>, JpaSpecificationExecutor<ActivationToken> {
}