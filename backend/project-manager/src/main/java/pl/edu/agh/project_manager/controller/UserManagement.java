package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.project_manager.controller.dto.AdminUserInvitationRequest;
import pl.edu.agh.project_manager.controller.dto.ManagerUserInvitationRequest;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.UserInvitationService;
import pl.edu.agh.project_manager.service.command.AdminInviteUserCommand;
import pl.edu.agh.project_manager.service.command.ManagerInviteUserCommand;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
class UserManagement {
    private final UserInvitationService invitationService;

    @PostMapping("/admin/invitations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminInvite(
            @Valid @RequestBody AdminUserInvitationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        var command = new AdminInviteUserCommand(
                request.email(),
                UserRole.valueOf(request.role().name()),
                principal.userId()
        );

        invitationService.inviteUser(command);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @PostMapping("/manager/invitations")
    @PreAuthorize("hasRole('LINEAR_MANAGER')")
    public ResponseEntity<Void> managerInvite(
            @Valid @RequestBody ManagerUserInvitationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        var command = new ManagerInviteUserCommand(
                request.email(),
                principal.userId()
        );

        invitationService.inviteUser(command);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
