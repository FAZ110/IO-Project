package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.controller.dto.qualification.AddQualificationRequest;
import pl.edu.agh.project_manager.controller.dto.qualification.QualificationResponse;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.QualificationService;

import java.util.List;

@RestController
@RequestMapping("/api/qualifications")
@RequiredArgsConstructor
public class QualificationController {

    private final QualificationService qualificationService;

    @GetMapping
    public ResponseEntity<List<QualificationResponse>> getMyQualifications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<QualificationResponse> myQualifications = qualificationService.getUserQualifications(principal.userId());
        return ResponseEntity.ok(myQualifications);
    }

    @PostMapping
    public ResponseEntity<QualificationResponse> addQualification(
            @Valid @RequestBody AddQualificationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        QualificationResponse added = qualificationService.addQualificationToUser(principal.userId(), request.name());
        return ResponseEntity.status(HttpStatus.CREATED).body(added);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeQualification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        qualificationService.deleteQualification(id, principal.userId());
        return ResponseEntity.noContent().build();
    }
}