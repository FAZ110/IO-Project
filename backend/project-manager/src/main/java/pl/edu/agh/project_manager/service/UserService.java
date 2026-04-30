package pl.edu.agh.project_manager.service;

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
import pl.edu.agh.project_manager.controller.dto.user.SimpleUserResponse;
import pl.edu.agh.project_manager.controller.dto.user.UserResponse;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
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
        List<User> users = userRepository.searchUserByFullName(search);

        return users.stream()
                .map(SimpleUserResponse::fromUser)
                .toList();
    }

    public User getUserEntityOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND, "Cannot find user: " + userId));
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
