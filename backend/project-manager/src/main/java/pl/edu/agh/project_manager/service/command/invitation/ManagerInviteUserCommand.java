<<<<<<<< HEAD:backend/project-manager/src/main/java/pl/edu/agh/project_manager/service/command/invitation/ManagerInviteUserCommand.java
package pl.edu.agh.project_manager.service.command.invitation;
========
package pl.edu.agh.project_manager.service.command.user;
>>>>>>>> 92cad07 (Cleanup):backend/project-manager/src/main/java/pl/edu/agh/project_manager/service/command/user/ManagerInviteUserCommand.java

import java.util.UUID;

public record ManagerInviteUserCommand(
        String email,

        UUID supervisorId
) {
}
