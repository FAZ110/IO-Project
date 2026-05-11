package pl.edu.agh.project_manager.security.access;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.repository.user.UserRepository;

import java.util.UUID;

@Component("qualificationSecurity")
@RequiredArgsConstructor
public class QualificationSecurity {
    private final UserRepository userRepository;

    public boolean isManagerForUser(UUID managerId, UUID userId) {
        return userRepository.findById(userId)
                .map(user -> user.getSupervisor() != null &&
                        user.getSupervisor().getId().equals(managerId))
                .orElse(false);
    }
}
