package pl.edu.agh.project_manager.controller.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.qualification.AddQualificationRequest;
import pl.edu.agh.project_manager.controller.dto.qualification.QualificationResponse;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.user.QualificationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/me/qualifications")
@RequiredArgsConstructor
public class QualificationController {

    private final QualificationService qualificationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<QualificationResponse>> getMyQualifications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<QualificationResponse> myQualifications = qualificationService.getUserQualifications(principal.userId());
        return ResponseEntity.ok(myQualifications);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<QualificationResponse>> addQualification(
            @Valid @RequestBody AddQualificationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<QualificationResponse> added = qualificationService.addQualificationsToUser(
                principal.userId(),
                request.skillNames(),
                request.skillIds()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(added);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeQualification(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        qualificationService.deleteQualification(id, principal.userId());
        return ResponseEntity.noContent().build();
    }
}
