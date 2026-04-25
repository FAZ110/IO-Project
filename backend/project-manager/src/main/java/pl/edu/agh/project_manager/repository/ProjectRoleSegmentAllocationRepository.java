package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.edu.agh.project_manager.domain.entity.ProjectRoleSegmentAllocation;

import java.util.List;
import java.util.UUID;

public interface ProjectRoleSegmentAllocationRepository extends JpaRepository<ProjectRoleSegmentAllocation, UUID> {
    @Query("""
    SELECT a FROM ProjectRoleSegmentAllocation a
    JOIN FETCH a.segment s
    JOIN a.projectRole r
    JOIN ProjectMember m ON m.role = r
    WHERE m.user.id = :userId
      AND m.membershipStatus = pl.edu.agh.project_manager.domain.enums.MembershipStatus.ACCEPTED
    ORDER BY s.startDate ASC
    """)
    List<ProjectRoleSegmentAllocation> findAllUserAllocations(@Param("userId") UUID userId);
}