package pl.edu.agh.project_manager.controller.projectgroup;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.project_group.AllGroupsResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.ProjectGroupCreationRequest;
import pl.edu.agh.project_manager.controller.dto.project_group.SingleGroupDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.project_group.SingleGroupResponse;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.projectgroup.ProjectGroupsService;
import pl.edu.agh.project_manager.service.command.project.ProjectGroupCreationCommand;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class ProjectGroupController {

    private final ProjectGroupsService projectGroupsService;

    @GetMapping("/groups")
    public ResponseEntity<AllGroupsResponse> getAllGroups(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok().body(projectGroupsService.getAllGroups(userPrincipal));
    }

    @GetMapping("/groups/wallets")
    public ResponseEntity<List<SingleGroupResponse>> getAllWallets() {
        return ResponseEntity.ok().body(projectGroupsService.getWalletGroups());
    }

    @GetMapping("/groups/programs")
    public ResponseEntity<List<SingleGroupResponse>> getAllPrograms() {
        return ResponseEntity.ok().body(projectGroupsService.getProgramGroups());
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<SingleGroupDetailsResponse> getSingleGroup(@PathVariable UUID groupId) {
        return ResponseEntity.ok().body(projectGroupsService.getGroupById(groupId));
    }

    @PostMapping("/groups")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'AUTHORITY')")
    public ResponseEntity<Map<String, UUID>> createGroup(
            @Valid @RequestBody ProjectGroupCreationRequest projectGroupCreationRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        ProjectGroupCreationCommand command = projectGroupCreationRequest.toCommand(userPrincipal.userId());

        UUID createdGroupId = projectGroupsService.createGroup(command);
        return ResponseEntity.ok().body(Map.of("id", createdGroupId));
    }
}
