<<<<<<<< HEAD:backend/project-manager/src/main/java/pl/edu/agh/project_manager/service/command/invitation/AdminInviteUserCommand.java
package pl.edu.agh.project_manager.service.command.invitation;
========
package pl.edu.agh.project_manager.service.command.user;
>>>>>>>> 92cad07 (Cleanup):backend/project-manager/src/main/java/pl/edu/agh/project_manager/service/command/user/AdminInviteUserCommand.java

import pl.edu.agh.project_manager.domain.enums.UserRole;

import java.util.UUID;

public record AdminInviteUserCommand(
        String email,

        UserRole role,

        UUID supervisorId
) {
}
