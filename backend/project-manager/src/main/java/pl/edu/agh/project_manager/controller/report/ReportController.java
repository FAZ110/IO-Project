package pl.edu.agh.project_manager.controller.report;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.report.ReportService;

import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/{resourceId}")
    public ResponseEntity<byte[]> downloadRisksCsv(
            @PathVariable UUID resourceId,
            @RequestParam ReportType type,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        byte[] reportData = switch (type) {
            case PROJECT_CARD_PDF -> reportService.generateProjectCardPdf(resourceId, user);
            case PROJECT_RISKS_PDF -> reportService.generateProjectRisksPdf(resourceId, user);
            case PROJECT_RISKS_CSV -> reportService.generateProjectRisksCsv(resourceId, user);
            case GROUP_PROJECTS_CSV -> reportService.generatePortfolioCsv(resourceId, user);
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(type.getContentType()));

        ContentDisposition disposition = ContentDisposition.attachment()
                .filename(type.getFilename())
                .build();
        headers.setContentDisposition(disposition);

        return ResponseEntity.ok()
                .headers(headers)
                .body(reportData);
    }
}