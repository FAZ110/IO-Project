package pl.edu.agh.project_manager.service.report;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.controller.dto.user.UserResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectPdfGeneratorTest {

    @Mock
    private TemplateEngine templateEngine;

    @InjectMocks
    private ProjectPdfGenerator projectPdfGenerator;

    private ProjectResponse projectData;

    @BeforeEach
    void setUp() {
        UserResponse manager = new UserResponse(UUID.randomUUID(),"john.doe@example.com", "John",  "Doe", null,null, null, List.of()
        );
        projectData = new ProjectResponse(UUID.randomUUID(), "Test Project", "Description", LocalDate.now(), LocalDate.now().plusMonths(6), true, manager, null);
    }

    @Test
    @DisplayName("Should generate PDF from HTML content")
    void generatePdf_Success() {
        // Given
        String templateName = "test-template";
        String htmlContent = "<html><body><h1>Test Project</h1></body></html>";
        when(templateEngine.process(eq(templateName), any(Context.class))).thenReturn(htmlContent);

        // When
        byte[] pdfBytes = projectPdfGenerator.generate(projectData, templateName);

        // Then
        assertThat(pdfBytes).isNotNull();
        assertThat(pdfBytes.length).isGreaterThan(0);

        assertThat(new String(pdfBytes, 0, 4)).isEqualTo("%PDF");
    }
}
