package pl.edu.agh.project_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.ProjectGroups;
import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.List;
import java.util.UUID;

public interface ProjectGroupsRepository extends JpaRepository<ProjectGroups, UUID> {

    List<ProjectGroups> getSingleGroupByGroupType(GroupType groupType);
}
