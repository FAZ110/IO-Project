package pl.edu.agh.project_manager.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import pl.edu.agh.project_manager.domain.entity.user.ActivationToken;

import java.util.Optional;
import java.util.UUID;

public interface ActivationTokenRepository extends JpaRepository<ActivationToken, UUID>, JpaSpecificationExecutor<ActivationToken> {

    Optional<ActivationToken> findByToken(String token);

    Optional<ActivationToken> findByUser_Id(UUID userId);
}