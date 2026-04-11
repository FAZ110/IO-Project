package pl.edu.agh.project_manager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.domain.entity.ActivationToken;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.service.command.AdminUserInvitationCommand;
import pl.edu.agh.project_manager.repository.ActivationTokenRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.ManagerUserInvitationCommand;
import pl.edu.agh.project_manager.service.command.SendInvitationCommand;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserInvitationService {
    private final UserRepository userRepository;
    private final ActivationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Transactional
    public void inviteUser(AdminUserInvitationCommand command) {
// TODO:
//        if (userRepository.existsByEmail(command.email())) {
//            throw new UserAlreadyExistsException(command.email());
//        }

        var supervisor = fetchUser(command.supervisorId());

        var newUser = createInvitedUser(command.email(), command.role(), supervisor);
        userRepository.save(newUser);

        var activationToken = createTokenForUser(newUser);

        sendInvitationEmail(command.email(), activationToken);
    }

    @Transactional
    public void inviteUser(ManagerUserInvitationCommand command) {
        var supervisor = fetchUser(command.supervisorId());

        var newUser = createInvitedUser(command.email(), UserRole.COMMON, supervisor);
        userRepository.save(newUser);

        var activationToken = createTokenForUser(newUser);

        sendInvitationEmail(command.email(), activationToken);
    }

    private String createTokenForUser(User user) {
        var activationToken = new ActivationToken();
        activationToken.setUser(user);
        tokenRepository.save(activationToken);
        return activationToken.getToken();
    }

    private void sendInvitationEmail(String email, String activationToken) {
        var sendInvitationCommand = new SendInvitationCommand(email, activationToken);
        emailService.sendInvitation(sendInvitationCommand);
    }

    private User fetchUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono supervisora o ID: " + id));
// TODO:
//                .orElseThrow(() -> new EntityNotFoundException("Supervisor not found"));
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
