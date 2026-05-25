package pl.edu.agh.project_manager.service.report;

import com.opencsv.CSVWriter;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.controller.dto.project_risk.ProjectRiskResponse;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class RiskCsvGenerator implements CsvGenerator<ProjectRiskResponse> {

    private static final byte[] BOM = new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};
    private static final String[] HEADERS = {"Nazwa", "Opis", "Prawdopodobieństwo"};

    @Override
    public byte[] generate(List<ProjectRiskResponse> data) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            baos.write(BOM);

            try (OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
                 CSVWriter csvWriter = new CSVWriter(writer)) {

                csvWriter.writeNext(HEADERS);

                for (ProjectRiskResponse risk : data) {
                    String[] row = {
                            risk.name(),
                            risk.description(),
                            String.valueOf(risk.probability())
                    };
                    csvWriter.writeNext(row);
                }
                
                csvWriter.flush();
            }
            
            return baos.toByteArray();
        } catch (IOException e) {
            throw new ApplicationException(ApiErrorCode.REPORT_GENERATION_ERROR, "Błąd podczas generowania pliku CSV: " + e.getMessage());
        }
    }
}