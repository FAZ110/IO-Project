<<<<<<<< HEAD:backend/project-manager/src/main/java/pl/edu/agh/project_manager/controller/dto/invitation/AdminUserInvitationRequest.java
package pl.edu.agh.project_manager.controller.dto.invitation;
========
package pl.edu.agh.project_manager.controller.dto.user;
>>>>>>>> 92cad07 (Cleanup):backend/project-manager/src/main/java/pl/edu/agh/project_manager/controller/dto/user/AdminUserInvitationRequest.java

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminUserInvitationRequest(
        @NotBlank(message = "Email nie może być pusty")
        @Email(message = "Niepoprawny format adresu email")
        String email,

        @NotNull(message = "Rola musi zostać określona")
        AdminAssignableRole role
) {
}
