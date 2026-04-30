package pl.edu.agh.project_manager.repository.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMember;
import pl.edu.agh.project_manager.domain.enums.MembershipStatus;

import java.util.List;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {

    @Query("SELECT m FROM ProjectMember m " +
            "JOIN FETCH m.project " +
            "JOIN FETCH m.user ")
    List<ProjectMember> findAllWithDetails();
}