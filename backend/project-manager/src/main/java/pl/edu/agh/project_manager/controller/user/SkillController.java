package pl.edu.agh.project_manager.controller.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.project_manager.controller.dto.qualification.SkillSuggestion;
import pl.edu.agh.project_manager.service.user.QualificationService;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final QualificationService qualificationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SkillSuggestion>> searchSkills(@RequestParam String query) {
        return ResponseEntity.ok(qualificationService.searchSkills(query));
    }
}
