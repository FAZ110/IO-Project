package pl.edu.agh.project_manager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.PagedResponse;
import pl.edu.agh.project_manager.controller.dto.user.UserResponse;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ProjectRepository;
import pl.edu.agh.project_manager.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public PagedResponse<UserResponse> getUsers(int pageNumber, int pageSize, UserRole userRole, UserStatus status, String search) {
        PageRequest pageable = PageRequest.of(pageNumber, pageSize, Sort.by("email").ascending());
        String searchTrimmed = (search != null && search.isBlank()) ? null : search;
        Page<User> users = userRepository.findUsersWithFilters(userRole, status, searchTrimmed, pageable);
        return PagedResponse.from(users, UserResponse::from);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        projectRepository.clearProjectManager(userId);
        userRepository.clearSupervisor(userId);

        userRepository.delete(user);
    }
}
