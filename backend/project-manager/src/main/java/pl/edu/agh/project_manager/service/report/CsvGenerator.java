package pl.edu.agh.project_manager.service.report;

import java.util.List;

public interface CsvGenerator<T> {
    byte[] generate(List<T> data);
}
