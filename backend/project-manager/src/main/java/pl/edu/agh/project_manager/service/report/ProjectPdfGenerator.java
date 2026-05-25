package pl.edu.agh.project_manager.service.report;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;

import java.io.ByteArrayOutputStream;

@Component
@RequiredArgsConstructor
public class ProjectPdfGenerator implements PdfGenerator<ProjectResponse> {

    private final TemplateEngine templateEngine;

    @Override
    public byte[] generate(ProjectResponse data, String templateName) {
        Context context = new Context();
        context.setVariable("project", data);

        String htmlContent = templateEngine.process(templateName, context);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(os);
            builder.run();

            return os.toByteArray();
        } catch (Exception e) {
            throw new ApplicationException(ApiErrorCode.REPORT_GENERATION_ERROR, "Błąd podczas generowania pliku PDF: " + e.getMessage());
        }
    }
}
