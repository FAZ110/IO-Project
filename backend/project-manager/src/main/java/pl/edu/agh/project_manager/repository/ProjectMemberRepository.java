package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.edu.agh.project_manager.domain.entity.ProjectMember;
import pl.edu.agh.project_manager.domain.enums.MembershipStatus;

import java.util.List;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {
    boolean existsByUserIdAndProjectIdAndMembershipStatus(
            UUID userId,
            UUID projectId,
            MembershipStatus membershipStatus
    );

    @Query("SELECT m FROM ProjectMember m " +
            "JOIN FETCH m.project " +
            "JOIN FETCH m.user " +
            "JOIN FETCH m.role")
    List<ProjectMember> findAllWithDetails();

    @Query("SELECT m FROM ProjectMember m " +
            "JOIN FETCH m.project " +
            "JOIN FETCH m.user " +
            "JOIN FETCH m.role " +
            "WHERE m.membershipStatus = :status")
    List<ProjectMember> findAllWithDetailsByMembershipStatus(MembershipStatus status);
}