package pl.edu.agh.project_manager.service.user;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.PagedResponse;
import pl.edu.agh.project_manager.controller.dto.project.ProjectAssignmentUserWorkloadResponse;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.controller.dto.project.UserProjectMembershipResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.OwnedGroupResponse;
import pl.edu.agh.project_manager.controller.dto.user.SimpleUserResponse;
import pl.edu.agh.project_manager.controller.dto.user.UserResponse;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectAssignmentRepository;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.repository.projectgroup.ProjectGroupRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;
import pl.edu.agh.project_manager.util.assignments.AssignmentsUtil;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final ProjectGroupRepository projectGroupRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public PagedResponse<UserResponse> getUsers(int pageNumber, int pageSize, UserRole userRole, UserStatus status, String search) {
        PageRequest pageable = PageRequest.of(pageNumber, pageSize, Sort.by("email").ascending());
        String searchPattern = (search != null && !search.isBlank())
                ? "%" + search.toLowerCase() + "%"
                : null;

        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (userRole != null) {
                predicates.add(cb.equal(root.get("userRole"), userRole));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("userStatus"), status));
            }
            if (searchPattern != null) {
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("email")), searchPattern),
                        cb.like(cb.lower(root.<String>get("name")), searchPattern),
                        cb.like(cb.lower(root.<String>get("surname")), searchPattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<User> users = userRepository.findAll(spec, pageable);
        return PagedResponse.from(users, UserResponse::from);
    }

    @Transactional
    public void changePassword(UUID userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ApplicationException(ApiErrorCode.INVALID_CURRENT_PASSWORD);
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new ApplicationException(ApiErrorCode.PASSWORD_SAME_AS_CURRENT);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        projectRepository.clearProjectManager(userId);
        userRepository.clearSupervisor(userId);

        userRepository.delete(user);
    }

    public List<SimpleUserResponse> searchUsers(String search) {
        return userRepository.searchUserByFullName(search).stream()
                .map(SimpleUserResponse::fromUser)
                .toList();
    }

    public List<SimpleUserResponse> searchUsersByRole(String search, UserRole role) {
        return userRepository.searchUserByFullNameAndRole(search, role).stream()
                .map(SimpleUserResponse::fromUser)
                .toList();
    }

    public User getUserEntityOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user: " + userId));
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user: " + userId));
        return UserResponse.from(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getSubordinates(UUID supervisorId) {
        if (!userRepository.existsById(supervisorId)) {
            throw new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user: " + supervisorId);
        }
        return userRepository.findAllBySupervisor_Id(supervisorId).stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getManagedProjects(UUID managerId) {
        if (!userRepository.existsById(managerId)) {
            throw new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user: " + managerId);
        }
        return projectRepository.findAllByProjectManagerId(managerId).stream()
                .map(ProjectResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OwnedGroupResponse> getRelatedProjectGroups(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user: " + userId);
        }

        List<pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup> owned =
                projectGroupRepository.findAllByOwner_IdOrderByNameAsc(userId);

        Map<UUID, pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup> related =
                new LinkedHashMap<>();
        owned.forEach(g -> related.put(g.getId(), g));

        projectRepository.findAllByProjectManagerId(userId).stream()
                .map(p -> p.getProjectGroup())
                .filter(g -> g != null)
                .forEach(g -> related.putIfAbsent(g.getId(), g));

        Set<UUID> ownedIds = owned.stream().map(g -> g.getId()).collect(Collectors.toSet());

        return related.values().stream()
                .map(g -> OwnedGroupResponse.from(g, ownedIds.contains(g.getId())))
                .sorted(Comparator
                        .comparing(OwnedGroupResponse::isOwner).reversed()
                        .thenComparing(OwnedGroupResponse::name))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserProjectMembershipResponse> getProjectMemberships(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user: " + userId);
        }
        List<ProjectAssignment> assignments = projectAssignmentRepository
                .findAllByUserIdAndStatus(userId, AssignmentStatus.ACCEPTED);

        Map<Project, List<ProjectAssignment>> byProject = assignments.stream()
                .collect(Collectors.groupingBy(ProjectAssignment::getProject, LinkedHashMap::new, Collectors.toList()));

        return byProject.entrySet().stream()
                .map(e -> UserProjectMembershipResponse.from(e.getKey(), e.getValue()))
                .toList();
    }

    public List<User> getUsersByIdsOrThrow(List<UUID> userIds, String errorMessage) {
        long uniqueCount = userIds.stream().distinct().count();
        List<User> users = userRepository.findAllById(userIds);

        if (users.size() != uniqueCount) {
            throw new ApplicationException(ApiErrorCode.USER_NOT_FOUND, errorMessage);
        }
        return users;
    }
}
