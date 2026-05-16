package pl.edu.agh.project_manager.service.user;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.domain.entity.user.ActivationToken;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.domain.event.SystemNewEmployeeEvent;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.service.command.invitation.AdminInviteUserCommand;
import pl.edu.agh.project_manager.repository.user.ActivationTokenRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;
import pl.edu.agh.project_manager.service.command.invitation.SendInvitationCommand;
import pl.edu.agh.project_manager.service.common.EmailSender;

import java.util.UUID;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserInvitationService {
    private final UserRepository userRepository;
    private final ActivationTokenRepository tokenRepository;
    private final EmailSender emailSender;

    @Transactional
    public void inviteUser(AdminInviteUserCommand command) {
        if (userRepository.existsByEmail(command.email())) {
            throw new ApplicationException(ApiErrorCode.INVITATION_USER_ALREADY_EXISTS);
        }

        User supervisor = fetchAndValidateSupervisor(command.supervisorId());

        User newUser = createInvitedUser(command.email(), command.role(), supervisor);
        userRepository.save(newUser);

        var activationToken = createTokenForUser(newUser);

        sendInvitationEmail(command.email(), activationToken);
    }

    private User fetchAndValidateSupervisor(UUID supervisorId) {
        if (supervisorId == null) {
            return null;
        }

        User supervisor = userRepository.findById(supervisorId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        if (supervisor.getUserRole() != UserRole.LINEAR_MANAGER && supervisor.getUserRole() != UserRole.AUTHORITY) {
            throw new ApplicationException(ApiErrorCode.INVALID_SUPERVISOR_ROLE);
        }

        return supervisor;
    }

    private String createTokenForUser(User user) {
        var activationToken = new ActivationToken();
        activationToken.setUser(user);
        var newToken = tokenRepository.save(activationToken);
        return newToken.getToken();
    }

    private void sendInvitationEmail(String email, String activationToken) {
        var sendInvitationCommand = new SendInvitationCommand(email, activationToken);
        emailSender.sendInvitation(sendInvitationCommand);
    }

    private User fetchSupervisor(UUID supervisorId) {
        if (supervisorId == null) return null;
        return userRepository.findById(supervisorId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.INVITATION_SUPERVISOR_NOT_FOUND));
    }

    @Transactional
    public void resendInvitation(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        if (user.getUserStatus() != UserStatus.PENDING) {
            throw new ApplicationException(ApiErrorCode.USER_NOT_PENDING);
        }

        Optional<ActivationToken> existing = tokenRepository.findByUser_Id(userId);
        String token;
        if (existing.isPresent() && !existing.get().isExpired()) {
            token = existing.get().getToken();
        } else {
            existing.ifPresent(tokenRepository::delete);
            token = createTokenForUser(user);
        }

        sendInvitationEmail(user.getEmail(), token);
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
