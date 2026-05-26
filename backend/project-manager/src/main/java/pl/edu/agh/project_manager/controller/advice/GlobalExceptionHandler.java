package pl.edu.agh.project_manager.controller.advice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;

import java.util.HashMap;
import java.util.stream.Collectors;

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

    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(RuntimeException ex) {
        log.warn("Authentication failed: {}", ex.getMessage());

        var error = ApiErrorCode.BAD_CREDENTIALS;
        var body = new ApiErrorResponse(error.getCode(), error.getMessage());

        return ResponseEntity
                .status(error.getHttpStatus())
                .body(body);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthorizationDeniedException(AuthorizationDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());

        var error = ApiErrorCode.ACCESS_DENIED;

        var body = new ApiErrorResponse(error.getCode(), error.getMessage());

        return ResponseEntity
                .status(error.getHttpStatus())
                .body(body);
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        var error = ApiErrorCode.VALIDATION_FAILED;

        var body = new ApiErrorResponse(error.getCode(), message);

        return ResponseEntity
                .status(error.getHttpStatus())
                .body(body);
    }
}