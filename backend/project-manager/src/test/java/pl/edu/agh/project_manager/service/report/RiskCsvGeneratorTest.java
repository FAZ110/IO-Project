package pl.edu.agh.project_manager.service.report;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.agh.project_manager.controller.dto.project.RiskResponse;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class RiskCsvGeneratorTest {

    private RiskCsvGenerator riskCsvGenerator;

    @BeforeEach
    void setUp() {
        riskCsvGenerator = new RiskCsvGenerator();
    }

    @Test
    @DisplayName("Should generate CSV content correctly")
    void generateCsv_Success() {
        // Given
        RiskResponse risk1 = new RiskResponse(UUID.randomUUID(), "Risk 1", "Description 1", 50);
        RiskResponse risk2 = new RiskResponse(UUID.randomUUID(), "Risk 2", "Description 2", 80);
        List<RiskResponse> risks = List.of(risk1, risk2);

        // When
        byte[] resultBytes = riskCsvGenerator.generate(risks);
        
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
        assertThat(lines[0]).contains("\"Nazwa\",\"Opis\",\"Prawdopodobieństwo\"");
        assertThat(lines[1]).contains("\"Risk 1\",\"Description 1\",\"50\"");
        assertThat(lines[2]).contains("\"Risk 2\",\"Description 2\",\"80\"");
    }

    @Test
    @DisplayName("Should generate empty CSV with headers when list is empty")
    void generateCsv_EmptyList() {
        // Given
        List<RiskResponse> risks = List.of();

        // When
        byte[] resultBytes = riskCsvGenerator.generate(risks);

        // Then
        assertThat(resultBytes).isNotNull();
        
        String content = new String(resultBytes, 3, resultBytes.length - 3, StandardCharsets.UTF_8);
        String[] lines = content.split("\n");
        
        assertThat(lines).hasSize(1);
        assertThat(lines[0]).contains("\"Nazwa\",\"Opis\",\"Prawdopodobieństwo\"");
    }
}
