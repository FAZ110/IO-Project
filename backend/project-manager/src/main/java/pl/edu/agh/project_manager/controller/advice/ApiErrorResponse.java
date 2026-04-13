package pl.edu.agh.project_manager.controller.advice;

public record ApiErrorResponse(
        String code,
        String message
) {
}
