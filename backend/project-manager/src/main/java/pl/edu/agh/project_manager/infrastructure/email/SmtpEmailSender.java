package pl.edu.agh.project_manager.infrastructure.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import pl.edu.agh.project_manager.service.command.invitation.SendInvitationCommand;
import pl.edu.agh.project_manager.service.common.EmailSender;
import org.springframework.mail.javamail.JavaMailSender;

@Service
@Profile("prod")
public class SmtpEmailSender implements EmailSender {

     private final JavaMailSender mailSender;

     @Value("${application.app.frontend.url}")
     private String URL;

     @Value("${application.from.email}")
     private String fromEmail;

     public SmtpEmailSender(JavaMailSender mailSender) {
         this.mailSender = mailSender;
     }

    @Override
    public void sendInvitation(SendInvitationCommand command) {
        SimpleMailMessage message = new SimpleMailMessage();

        String registrationLink = UriComponentsBuilder.fromUriString(URL)
                .path("/register")
                .queryParam("token", command.activationToken())
                .queryParam("email", command.email())
                .build()
                .toUriString();

        message.setTo(command.email());
        message.setFrom(fromEmail);
        message.setSubject("Zaproszenie do systemu");
        message.setText("Link do rejestracji w systemie:\n" + registrationLink);

        mailSender.send(message);
    }
}
