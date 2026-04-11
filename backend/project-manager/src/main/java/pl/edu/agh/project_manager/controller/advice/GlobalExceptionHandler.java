package pl.edu.agh.project_manager.controller.advice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApplicationException.class)
    public ResponseEntity<ApiErrorResponse> handleAppException(ApplicationException ex) {
        var errorCode = ex.getErrorCode();
        var message = ex.getMessage() != null && !ex.getMessage().isBlank()
                ? ex.getMessage()
                : errorCode.getMessage();

        log.warn("Application error occurred: {} - {}", errorCode.getCode(), message);

        var body = new ApiErrorResponse(errorCode.getCode(), message);
        return ResponseEntity.status(errorCode.getHttpStatus()).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneralException(Exception ex) {
        log.error("Unexpected system error: ", ex);

        var error = ApiErrorCode.INTERNAL_SERVER_ERROR;

        var body = new ApiErrorResponse(error.getCode(), error.getMessage());

        return ResponseEntity
                .status(error.getHttpStatus())
                .body(body);
    }
}