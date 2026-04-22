package pl.edu.agh.project_manager.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import pl.edu.agh.project_manager.domain.entity.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.supervisor = null WHERE u.supervisor.id = :supervisorId")
    void clearSupervisor(@Param("supervisorId") UUID supervisorId);

    @Override
    @EntityGraph(attributePaths = {"supervisor"})
    Page<User> findAll(Specification<User> spec, Pageable pageable);
}