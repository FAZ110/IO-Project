package pl.edu.agh.project_manager.service.project;

import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.JoinType;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMember;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.security.UserPrincipal;

import java.util.UUID;

public class ProjectSpecification {

    public static Specification<Project> withSearchPattern(String query) {
        return (root, query1, cb) -> {
            String pattern = "%" + query.toLowerCase() + "%";
            return cb.like(cb.lower(root.get("title")), pattern);
        };
    }

    public static Specification<Project> accessibleByUser(UserPrincipal user) {
        return (root, query, cb) -> switch (user.userRole()) {
            case PROJECT_MANAGER ->
                    cb.equal(root.get("projectManager").get("id"), user.userId());
            case LINEAR_MANAGER, COMMON -> {
                Join<Project, ProjectMember> membersJoin = root.join("members");
                query.distinct(true);
                yield cb.equal(membersJoin.get("user").get("id"), user.userId());
            }
            case AUTHORITY -> {
                Join<Project, User> sponsorsJoin = root.join("sponsors", JoinType.LEFT);
                Join<Project, User> committeesJoin = root.join("committees", JoinType.LEFT);
                query.distinct(true);
                yield cb.or(
                        cb.equal(sponsorsJoin.get("id"), user.userId()),
                        cb.equal(committeesJoin.get("id"), user.userId())
                );
            }
            case ADMINISTRATOR -> cb.conjunction();
        };
    }

    public static Specification<Project> inGroup(UUID groupId) {
        return (root, query, cb) -> cb.equal(root.get("projectGroup").get("id"), groupId);
    }

    public static Specification<Project> unassigned() {
        return (root, query, cb) -> cb.isNull(root.get("projectGroup"));
    }

}
