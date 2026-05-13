package pl.edu.agh.project_manager.repository.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;

import java.util.List;
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

    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.name, ' ', u.surname)) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUserByFullName(@Param("query") String query);

    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.name, ' ', u.surname)) LIKE LOWER(CONCAT('%', :query, '%')) AND u.userRole = :role")
    List<User> searchUserByFullNameAndRole(@Param("query") String query, @Param("role") UserRole role);
}