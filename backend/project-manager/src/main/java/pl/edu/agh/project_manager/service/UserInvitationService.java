package pl.edu.agh.project_manager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.service.command.AdminUserInvitationCommand;
import pl.edu.agh.project_manager.repository.ActivationTokenRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.service.command.ManagerUserInvitationCommand;

@Service
@RequiredArgsConstructor
public class UserInvitationService {
    private final UserRepository userRepository;
    private final ActivationTokenRepository tokenRepository;

    public void inviteUser(AdminUserInvitationCommand command) {

    }

    public void inviteUser(ManagerUserInvitationCommand command) {

    }
}
