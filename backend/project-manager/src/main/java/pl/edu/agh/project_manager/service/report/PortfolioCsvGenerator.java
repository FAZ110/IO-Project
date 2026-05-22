package pl.edu.agh.project_manager.service.report;

import com.opencsv.CSVWriter;
import org.springframework.stereotype.Component;
import pl.edu.agh.project_manager.controller.dto.project.ProjectResponse;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class PortfolioCsvGenerator implements CsvGenerator<ProjectResponse> {

    private static final byte[] BOM = new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};
    private static final String[] HEADERS = {"Tytuł Projektu", "Opis", "Data rozpoczęcia", "Data zakończenia", "Status"};

    @Override
    public byte[] generate(List<ProjectResponse> data) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            baos.write(BOM);

            try (OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
                 CSVWriter csvWriter = new CSVWriter(writer)) {

                csvWriter.writeNext(HEADERS);

                for (ProjectResponse project : data) {
                    String[] row = {
                            project.title(),
                            project.description(),
                            project.startDate().toString(),
                            project.endDate().toString(),
                            project.isActive() ? "Aktywny" : "Zakończony"
                    };
                    csvWriter.writeNext(row);
                }
                
                csvWriter.flush();
            }
            
            return baos.toByteArray();
        } catch (IOException e) {
            throw new ApplicationException(ApiErrorCode.INTERNAL_SERVER_ERROR, "Błąd podczas generowania pliku CSV portfela: " + e.getMessage());
        }
    }
}
