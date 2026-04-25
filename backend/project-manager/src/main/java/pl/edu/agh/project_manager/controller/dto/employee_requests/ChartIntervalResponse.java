package pl.edu.agh.project_manager.controller.dto.employee_requests;

import java.time.LocalDate;

public record ChartIntervalResponse(
        LocalDate startDate,
        LocalDate endDate,
        int percentage
) {
}
