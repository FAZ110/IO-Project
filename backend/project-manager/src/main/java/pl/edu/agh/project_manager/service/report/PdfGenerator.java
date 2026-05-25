package pl.edu.agh.project_manager.service.report;

public interface PdfGenerator<T> {
    byte[] generate(T data, String templateName);
}
