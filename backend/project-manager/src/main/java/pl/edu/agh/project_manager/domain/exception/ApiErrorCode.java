package pl.edu.agh.project_manager.domain.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ApiErrorCode {
    INVITATION_USER_ALREADY_EXISTS("INV_001", HttpStatus.CONFLICT, "User with this email already exists"),
    INVITATION_SUPERVISOR_NOT_FOUND("INV_002", HttpStatus.NOT_FOUND, "Supervisor not found"),
    INVITATION_EMAIL_SEND_FAILED("INV_003", HttpStatus.BAD_GATEWAY, "Invitation email could not be sent"),

    VALIDATION_ERROR("GEN_001", HttpStatus.BAD_REQUEST, "Validation failed"),
    ACCESS_DENIED("GEN_002", HttpStatus.FORBIDDEN, "Access denied"),
    INTERNAL_SERVER_ERROR("GEN_999", HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected internal server error");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
