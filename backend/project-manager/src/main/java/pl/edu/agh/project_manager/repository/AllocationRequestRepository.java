package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.project_manager.domain.entity.AllocationRequest;

import java.util.List;
import java.util.UUID;

@Repository
public interface AllocationRequestRepository extends JpaRepository<AllocationRequest, UUID> {
    List<AllocationRequest> findByVacancyId(UUID vacancyId);
    List<AllocationRequest> findByCreatedById(UUID createdById);
}
