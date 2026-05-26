package pl.edu.agh.project_manager.controller.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.PagedResponse;
import pl.edu.agh.project_manager.controller.dto.invitation.AdminUserInvitationRequest;
import pl.edu.agh.project_manager.controller.dto.invitation.ResendInvitationRequest;
import pl.edu.agh.project_manager.controller.dto.project.ProjectAssignmentUserWorkloadResponse;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.controller.dto.project.UserProjectMembershipResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.OwnedGroupResponse;
import pl.edu.agh.project_manager.controller.dto.qualification.QualificationResponse;
import pl.edu.agh.project_manager.controller.dto.user.SimpleUserResponse;
import pl.edu.agh.project_manager.controller.dto.user.UserResponse;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.service.approval.AssignmentManagementService;
import pl.edu.agh.project_manager.service.user.QualificationService;
import pl.edu.agh.project_manager.service.user.UserInvitationService;
import pl.edu.agh.project_manager.service.user.UserService;
import pl.edu.agh.project_manager.service.command.invitation.AdminInviteUserCommand;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
class UserController {
    private final UserInvitationService invitationService;
    private final UserService userService;
    private final AssignmentManagementService assignmentManagementService;
    private final QualificationService qualificationService;

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
            @Valid @RequestBody AdminUserInvitationRequest request
    ) {
        var command = new AdminInviteUserCommand(
                request.email(),
                UserRole.valueOf(request.role().name()),
                request.supervisorId()
        );

        invitationService.inviteUser(command);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<SimpleUserResponse>> searchUsers(
            @RequestParam("search") String search,
            @RequestParam(required = false) UserSearchableRole userRole
    ) {
        if (userRole != null) {
            UserRole mappedRole = switch (userRole) {
                case COMMON -> UserRole.COMMON;
                case AUTHORITY -> UserRole.AUTHORITY;
                case LINEAR_MANAGER -> UserRole.LINEAR_MANAGER;
                case PROJECT_MANAGER -> UserRole.PROJECT_MANAGER;
                case ADMINISTRATOR -> UserRole.ADMINISTRATOR;
            };
            return ResponseEntity.ok(userService.searchUsersByRole(search, mappedRole));
        }
        return ResponseEntity.ok(userService.searchUsers(search));
    }

    @GetMapping("/users/{userId}/workload")
    public ResponseEntity<ProjectAssignmentUserWorkloadResponse> getUserWorkload(@PathVariable UUID userId) {
        return ResponseEntity.ok(assignmentManagementService.getUserWorkload(userId));
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @GetMapping("/users/{userId}/qualifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<QualificationResponse>> getUserQualifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(qualificationService.getUserQualifications(userId));
    }

    @GetMapping("/users/{userId}/subordinates")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserResponse>> getSubordinates(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getSubordinates(userId));
    }

    @GetMapping("/users/{userId}/projects")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProjectResponse>> getManagedProjects(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getManagedProjects(userId));
    }

    @GetMapping("/users/{userId}/memberships")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserProjectMembershipResponse>> getProjectMemberships(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getProjectMemberships(userId));
    }

    @GetMapping("/users/{userId}/groups")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OwnedGroupResponse>> getRelatedGroups(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getRelatedProjectGroups(userId));
    }
}
