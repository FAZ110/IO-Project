package pl.edu.agh.project_manager.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.service.command.SendInvitationCommand;

@Slf4j
@Service
public class EmailService {
    public void sendInvitation(SendInvitationCommand command) {
        log.info("--------------------------------------------------");
        log.info("SENDING INVITATION EMAIL");
        log.info("To: {}", command.email());
        log.info("Token: {}", command.activationToken());
        log.info("Registration link: http://localhost:8080/register?token={}", command.activationToken());
        log.info("--------------------------------------------------");
        throw new UnsupportedOperationException();
    }
}
