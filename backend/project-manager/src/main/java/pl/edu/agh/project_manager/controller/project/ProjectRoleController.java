//package pl.edu.agh.project_manager.controller.project;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import pl.edu.agh.project_manager.controller.dto.project.ProjectRoleStatusResponse;
//import pl.edu.agh.project_manager.service.ProjectRoleService;
//import pl.edu.agh.project_manager.service.project.ProjectService;
//import pl.edu.agh.project_manager.service.command.project.RoleCommand;
//
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/projects")
//@RequiredArgsConstructor
//public class ProjectRoleController {
//    private final ProjectRoleService projectRoleService;
//    private final ProjectService projectService;
//
//    @GetMapping("/{projectId}/roles/status")
//    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'AUTHORITY') or @projectSecurity.canAccessProject(#projectId, authentication.principal)")
//    public ResponseEntity<List<ProjectRoleStatusResponse>> getProjectRolesStatus(
//            @PathVariable UUID projectId
//    ) {
//        List<ProjectRoleStatusResponse> roles = projectRoleService.getProjectRolesStatus(projectId);
//        return ResponseEntity.ok(roles);
//    }
//
//    @PostMapping("/{projectId}/roles")
//    @PreAuthorize("@projectSecurity.isProjectManagerForProject(#request.projectId, principal)")
//    public ResponseEntity<Void> createProjectRole(
//            @PathVariable UUID projectId,
//            @RequestBody RoleCommand command
//    ) {
//        projectService.createProjectRole(projectId, command);
//        return ResponseEntity.status(HttpStatus.CREATED).build();
//    }
//}
