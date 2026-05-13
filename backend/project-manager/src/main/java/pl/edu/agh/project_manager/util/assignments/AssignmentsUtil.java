package pl.edu.agh.project_manager.util.assignments;

import pl.edu.agh.project_manager.controller.dto.common.ChartIntervalResponse;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class AssignmentsUtil {
    public static List<ChartIntervalResponse> generateWorkloadSteps(List<ProjectAssignment> assignments) {
        if (assignments.isEmpty()) return List.of();

        List<LocalDate> timeline = assignments.stream()
                .flatMap(a -> Stream.of(a.getStartDate(), a.getEndDate()))
                .distinct()
                .sorted()
                .toList();

        List<ChartIntervalResponse> steps = new ArrayList<>();

        for (int i = 0; i < timeline.size() - 1; i++) {
            LocalDate start = timeline.get(i);
            LocalDate end = timeline.get(i + 1);

            int totalPercent = assignments.stream()
                    .filter(a -> !a.getStartDate().isAfter(start) && !a.getEndDate().isBefore(end))
                    .mapToInt(ProjectAssignment::getUtilizationPercentage)
                    .sum();

            if (totalPercent > 0) {
                steps.add(new ChartIntervalResponse(start, end, totalPercent));
            }
        }

        return mergeContinuousSteps(steps);
    }

    private static List<ChartIntervalResponse> mergeContinuousSteps(List<ChartIntervalResponse> steps) {
        if (steps.size() < 2) return steps;

        List<ChartIntervalResponse> merged = new ArrayList<>();
        ChartIntervalResponse current = steps.getFirst();

        for (int i = 1; i < steps.size(); i++) {
            ChartIntervalResponse next = steps.get(i);

            if (current.percentage() == next.percentage() && current.endDate().equals(next.startDate())) {
                current = new ChartIntervalResponse(current.startDate(), next.endDate(), current.percentage());
            } else {
                merged.add(current);
                current = next;
            }
        }
        merged.add(current);

        return merged;
    }
}
