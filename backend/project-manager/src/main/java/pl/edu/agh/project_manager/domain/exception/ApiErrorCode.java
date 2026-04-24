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

    USER_NOT_FOUND("USR_002", HttpStatus.NOT_FOUND, "Cannot found user"),

    PROJECT_MANAGER_NOT_FOUND("PROJ_001", HttpStatus.NOT_FOUND, "Cannot found provided project manager"),
    PROJECT_NOT_FOUND("PROJ_002", HttpStatus.NOT_FOUND, "Cannot found provided project"),
    RISK_NOT_FOUND("RISK_001", HttpStatus.NOT_FOUND, "Cannot found provided risk in provided project"),

    PROJECT_GROUP_NOT_FOUND("PROJ_002", HttpStatus.NOT_FOUND, "Cannot found project group"),
    INVALID_MILESTONES("PROJ_003", HttpStatus.BAD_REQUEST, "Project must have at least start and end milestones defined"),
    INVALID_MILESTONE_ORDER("PROJ_004", HttpStatus.BAD_REQUEST, "Milestones must be chronologically ordered"),

    ACTIVATION_TOKEN_NOT_FOUND("AUTH_001", HttpStatus.NOT_FOUND, "Activation token is invalid or does not exist"),
    ACTIVATION_TOKEN_EXPIRED("AUTH_002", HttpStatus.BAD_REQUEST, "Activation token has expired"),
    BAD_CREDENTIALS("AUTH_003", HttpStatus.UNAUTHORIZED, "Invalid email or password"),
    MISSING_REFRESH_TOKEN("AUTH_004", HttpStatus.UNAUTHORIZED, "Refresh token is missing or cookie expired"),
    INVALID_REFRESH_TOKEN("AUTH_005", HttpStatus.UNAUTHORIZED, "Refresh token is invalid"),
    USER_NOT_PENDING("USR_002", HttpStatus.BAD_REQUEST, "Cannot resend invitation — user is not in PENDING status"),

    VALIDATION_ERROR("GEN_001", HttpStatus.BAD_REQUEST, "Validation failed"),
    ACCESS_DENIED("GEN_002", HttpStatus.FORBIDDEN, "Access denied"),
    INTERNAL_SERVER_ERROR("GEN_999", HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected internal server error"),

    QUALIFICATION_NOT_FOUND("QUAL_001", HttpStatus.NOT_FOUND, "Qualification not found");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
