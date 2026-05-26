package pl.edu.agh.project_manager.repository.projectgroup;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.List;
import java.util.UUID;

public interface ProjectGroupRepository extends JpaRepository<ProjectGroup, UUID> {

    List<ProjectGroup> getSingleGroupByGroupType(GroupType groupType);

    List<ProjectGroup> findAllByOwner_IdOrderByNameAsc(UUID ownerId);
}
