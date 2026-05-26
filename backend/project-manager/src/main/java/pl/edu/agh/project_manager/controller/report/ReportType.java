package pl.edu.agh.project_manager.controller.report;

public enum ReportType {
    PROJECT_CARD_PDF("karta_projektu.pdf", "application/pdf"),
    PROJECT_RISKS_PDF("rejestr_ryzyk.pdf", "application/pdf"),
    PROJECT_RISKS_CSV("rejestr_ryzyk.csv", "text/csv"),
    GROUP_PROJECTS_CSV("lista_projektow_grupy.csv", "text/csv");

    private final String filename;
    private final String contentType;

    ReportType(String filename, String contentType) {
        this.filename = filename;
        this.contentType = contentType;
    }

    public String getFilename() {
        return filename;
    }

    public String getContentType() {
        return contentType;
    }
}