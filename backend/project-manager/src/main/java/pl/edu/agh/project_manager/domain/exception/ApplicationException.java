package pl.edu.agh.project_manager.domain.exception;

import lombok.Getter;

@Getter
public class ApplicationException extends RuntimeException {
    private final ApiErrorCode errorCode;

    public ApplicationException(ApiErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ApplicationException(ApiErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
