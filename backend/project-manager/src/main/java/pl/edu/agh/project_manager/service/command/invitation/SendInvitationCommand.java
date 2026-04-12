<<<<<<<< HEAD:backend/project-manager/src/main/java/pl/edu/agh/project_manager/service/command/invitation/SendInvitationCommand.java
package pl.edu.agh.project_manager.service.command.invitation;
========
package pl.edu.agh.project_manager.service.command.user;
>>>>>>>> 92cad07 (Cleanup):backend/project-manager/src/main/java/pl/edu/agh/project_manager/service/command/user/SendInvitationCommand.java

public record SendInvitationCommand(
        String email,
        String activationToken
) {
}
