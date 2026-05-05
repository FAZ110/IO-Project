package pl.edu.agh.project_manager.service.common;

import pl.edu.agh.project_manager.service.command.invitation.SendInvitationCommand;

public interface EmailSender {
    void sendInvitation(SendInvitationCommand command);
}
