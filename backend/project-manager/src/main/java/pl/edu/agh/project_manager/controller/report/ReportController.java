package pl.edu.agh.project_manager.controller.report;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.report.ReportService;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/projects/{projectId}/reports/risks/csv")
    public ResponseEntity<byte[]> downloadRisksCsv(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        byte[] csvData = reportService.generateProjectRisksCsv(projectId, user);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "ryzyka_projektu.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

    @GetMapping("/projects/{projectId}/reports/card/pdf")
    public ResponseEntity<byte[]> downloadProjectCardPdf(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        byte[] pdfData = reportService.generateProjectCardPdf(projectId, user);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "karta_projektu.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfData);
    }

    @GetMapping("/projects/{projectId}/reports/risks/pdf")
    public ResponseEntity<byte[]> downloadRisksPdf(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        byte[] pdfData = reportService.generateProjectRisksPdf(projectId, user);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "rejestr_ryzyk.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfData);
    }

    @GetMapping("/groups/{groupId}/reports/projects/csv")
    public ResponseEntity<byte[]> downloadPortfolioCsv(
            @PathVariable UUID groupId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        byte[] csvData = reportService.generatePortfolioCsv(groupId, user);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "lista_projektow_grupy.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }
}
