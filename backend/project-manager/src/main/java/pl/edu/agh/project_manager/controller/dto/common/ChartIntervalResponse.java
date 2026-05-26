package pl.edu.agh.project_manager.controller.dto.common;

import java.time.LocalDate;

public record ChartIntervalResponse(
        LocalDate startDate,
        LocalDate endDate,
        int percentage
) {
}
