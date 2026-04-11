package pl.edu.agh.project_manager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.domain.entity.ActivationToken;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.service.command.AdminInviteUserCommand;
import pl.edu.agh.project_manager.repository.ActivationTokenRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.ManagerInviteUserCommand;
import pl.edu.agh.project_manager.service.command.SendInvitationCommand;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserInvitationService {
    private final UserRepository userRepository;
    private final ActivationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Transactional
    public void inviteUser(AdminInviteUserCommand command) {
        processInvitation(command.email(), command.role(), command.supervisorId());
    }

    @Transactional
    public void inviteUser(ManagerInviteUserCommand command) {
        processInvitation(command.email(), UserRole.COMMON, command.supervisorId());
    }

    private void processInvitation(String email, UserRole role, UUID supervisorId) {
        if (userRepository.existsByEmail(email)) {
            throw new ApplicationException(ApiErrorCode.INVITATION_USER_ALREADY_EXISTS);
        }

        var supervisor = fetchUser(supervisorId);

        var newUser = createInvitedUser(email, role, supervisor);
        userRepository.save(newUser);

        var activationToken = createTokenForUser(newUser);

        sendInvitationEmail(email, activationToken);
    }

    private String createTokenForUser(User user) {
        var activationToken = new ActivationToken();
        activationToken.setUser(user);
        var newToken = tokenRepository.save(activationToken);
        return newToken.getToken();
    }

    private void sendInvitationEmail(String email, String activationToken) {
        var sendInvitationCommand = new SendInvitationCommand(email, activationToken);
        emailService.sendInvitation(sendInvitationCommand);
    }

    private User fetchUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.INVITATION_SUPERVISOR_NOT_FOUND));
    }

    private User createInvitedUser(String email, UserRole role, User supervisor) {
        return User.builder()
                .email(email)
                .userRole(role)
                .supervisor(supervisor)
                .userStatus(UserStatus.PENDING)
                .build();
    }
}
