package pl.edu.agh.project_manager.infrastructure.email;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import pl.edu.agh.project_manager.service.command.invitation.SendInvitationCommand;
import pl.edu.agh.project_manager.service.common.EmailSender;

@Service
@Profile("prod")
public class SmtpEmailSender implements EmailSender {

    // private final JavaMailSender mailSender;

    @Override
    public void sendInvitation(SendInvitationCommand command) {
        // TODO
    }
}
