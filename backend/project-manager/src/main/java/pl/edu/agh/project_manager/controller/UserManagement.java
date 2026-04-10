package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.edu.agh.project_manager.controller.dto.AdminUserInvitationRequest;
import pl.edu.agh.project_manager.controller.dto.ManagerUserInvitationRequest;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.service.UserInvitationService;
import pl.edu.agh.project_manager.service.command.AdminUserInvitationCommand;
import pl.edu.agh.project_manager.service.command.ManagerUserInvitationCommand;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
class UserManagement {
    private final UserInvitationService invitationService;

    @PostMapping("/api/admin/invitations")
    public void adminInvite(@Valid @RequestBody AdminUserInvitationRequest request) {
        var command = new AdminUserInvitationCommand(
                request.email(),
                UserRole.valueOf(request.role().name())
        );

        invitationService.inviteUser(command);
    }

    @PostMapping("/api/manager/invitations")
    public void managerInvite(@Valid @RequestBody ManagerUserInvitationRequest request) {
        var command = new ManagerUserInvitationCommand(request.email());
        invitationService.inviteUser(command);
    }
}
