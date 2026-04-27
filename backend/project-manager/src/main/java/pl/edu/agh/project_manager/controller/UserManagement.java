package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.PagedResponse;
import pl.edu.agh.project_manager.controller.dto.invitation.AdminUserInvitationRequest;
import pl.edu.agh.project_manager.controller.dto.invitation.ManagerUserInvitationRequest;
import pl.edu.agh.project_manager.controller.dto.invitation.ResendInvitationRequest;
import pl.edu.agh.project_manager.controller.dto.user.SimpleUserResponse;
import pl.edu.agh.project_manager.controller.dto.user.UserResponse;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.UserInvitationService;
import pl.edu.agh.project_manager.service.UserService;
import pl.edu.agh.project_manager.service.command.invitation.AdminInviteUserCommand;
import pl.edu.agh.project_manager.service.command.invitation.ManagerInviteUserCommand;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
class UserManagement {
    private final UserInvitationService invitationService;
    private final UserService userService;

    @GetMapping("/users")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) UserRole userRole,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(userService.getUsers(pageNumber, pageSize, userRole, status, search));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users/invitation")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> resendInvitation(@Valid @RequestBody ResendInvitationRequest request) {
        invitationService.resendInvitation(request.userId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/invitations")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> createInviteAsAdmin(
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
    public ResponseEntity<Void> createInviteAsManager(
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

    @GetMapping("/users/search")
    public ResponseEntity<List<SimpleUserResponse>> searchUsers(@RequestParam("search") String search) {
        return ResponseEntity.ok(userService.searchUsers(search));
    }
}
