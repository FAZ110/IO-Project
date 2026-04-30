package pl.edu.agh.project_manager.infrastructure.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.service.command.invitation.SendInvitationCommand;
import pl.edu.agh.project_manager.service.common.EmailSender;

@Service
@Profile({"dev", "test"})
@Slf4j
public class ConsoleEmailSender implements EmailSender {
    public void sendInvitation(SendInvitationCommand command) {
        log.info("--------------------------------------------------");
        log.info("SENDING INVITATION EMAIL");
        log.info("To: {}", command.email());
        log.info("Token: {}", command.activationToken());
        log.info("Registration link: http://localhost:5173/register?token={}&email={}", command.activationToken(), command.email());
        log.info("--------------------------------------------------");
    }
}
