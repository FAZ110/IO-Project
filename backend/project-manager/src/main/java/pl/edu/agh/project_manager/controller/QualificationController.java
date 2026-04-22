package pl.edu.agh.project_manager.controller;

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
import pl.edu.agh.project_manager.service.QualificationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/me/qualifications")
@RequiredArgsConstructor
public class QualificationController {

    private final QualificationService qualificationService;

    @GetMapping
    @PreAuthorize("hasRole('COMMON')")
    public ResponseEntity<List<QualificationResponse>> getMyQualifications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<QualificationResponse> myQualifications = qualificationService.getUserQualifications(principal.userId());
        return ResponseEntity.ok(myQualifications);
    }

    @PostMapping
    @PreAuthorize("hasRole('COMMON')")
    public ResponseEntity<List<QualificationResponse>> addQualification(
                                                                         @Valid @RequestBody AddQualificationRequest request,
                                                                         @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<QualificationResponse> added = qualificationService.addQualificationsToUser(
                principal.userId(),
                request.skillNames()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(added);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMMON')")
    public ResponseEntity<Void> removeQualification(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        qualificationService.deleteQualification(id, principal.userId());
        return ResponseEntity.noContent().build();
    }
}