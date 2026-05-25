package pl.edu.agh.project_manager.service.report;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class PortfolioCsvGeneratorTest {

    private PortfolioCsvGenerator portfolioCsvGenerator;

    @BeforeEach
    void setUp() {
        portfolioCsvGenerator = new PortfolioCsvGenerator();
    }

    @Test
    @DisplayName("Should generate CSV for portfolio correctly")
    void generatePortfolioCsv_Success() {
        // Given
        ProjectResponse project1 = new ProjectResponse(UUID.randomUUID(), "Projekt A", "Opis A", LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31), true, null, null);
        ProjectResponse project2 = new ProjectResponse(UUID.randomUUID(), "Projekt B", "Opis B", LocalDate.of(2023, 5, 10), LocalDate.of(2025, 5, 9), false, null, null);
        List<ProjectResponse> projects = List.of(project1, project2);

        // When
        byte[] resultBytes = portfolioCsvGenerator.generate(projects);

        // Then
        assertThat(resultBytes).isNotNull();
        assertThat(resultBytes.length).isGreaterThan(0);

        // Verify BOM
        assertThat(resultBytes[0]).isEqualTo((byte) 0xEF);
        assertThat(resultBytes[1]).isEqualTo((byte) 0xBB);
        assertThat(resultBytes[2]).isEqualTo((byte) 0xBF);

        // Verify content
        String content = new String(resultBytes, 3, resultBytes.length - 3, StandardCharsets.UTF_8);
        String[] lines = content.split("\n");

        assertThat(lines).hasSize(3); // Headers + 2 rows
        assertThat(lines[0]).contains("\"Tytuł Projektu\",\"Opis\",\"Data rozpoczęcia\",\"Data zakończenia\",\"Status\"");
        assertThat(lines[1]).contains("\"Projekt A\",\"Opis A\",\"2024-01-01\",\"2024-12-31\",\"Aktywny\"");
        assertThat(lines[2]).contains("\"Projekt B\",\"Opis B\",\"2023-05-10\",\"2025-05-09\",\"Zakończony\"");
    }
    
}
