<<<<<<<< HEAD:backend/project-manager/src/main/java/pl/edu/agh/project_manager/controller/dto/invitation/ManagerUserInvitationRequest.java
package pl.edu.agh.project_manager.controller.dto.invitation;
========
package pl.edu.agh.project_manager.controller.dto.user;
>>>>>>>> 92cad07 (Cleanup):backend/project-manager/src/main/java/pl/edu/agh/project_manager/controller/dto/user/ManagerUserInvitationRequest.java

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ManagerUserInvitationRequest(
        @NotBlank(message = "Email nie może być pusty")
        @Email(message = "Niepoprawny format adresu email")
        String email
) {

}
