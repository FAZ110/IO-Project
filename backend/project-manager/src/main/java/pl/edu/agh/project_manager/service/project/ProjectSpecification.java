package pl.edu.agh.project_manager.service.project;

import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import pl.edu.agh.project_manager.domain.entity.project.Project;
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
                Join<Project, User> membersJoin = root.join("members");
                query.distinct(true);
                yield cb.equal(membersJoin.get("id"), user.userId());
            }
            case ADMINISTRATOR, AUTHORITY -> cb.conjunction();
        };
    }

    public static Specification<Project> inGroup(UUID groupId) {
        return (root, query, cb) -> cb.equal(root.get("projectGroup").get("id"), groupId);
    }

    public static Specification<Project> unassigned() {
        return (root, query, cb) -> cb.isNull(root.get("projectGroup"));
    }

}
