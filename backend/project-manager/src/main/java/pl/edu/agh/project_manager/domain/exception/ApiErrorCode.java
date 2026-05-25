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

    RISK_NOT_FOUND("RISK_001", HttpStatus.NOT_FOUND, "Cannot find provided risk in provided project"),

    PROJECT_MANAGER_NOT_FOUND("PROJ_001", HttpStatus.NOT_FOUND, "Cannot find provided project manager"),
    PROJECT_GROUP_NOT_FOUND("PROJ_002", HttpStatus.NOT_FOUND, "Cannot find project group"),
    INVALID_MILESTONE_DATE("PROJ_003", HttpStatus.BAD_REQUEST, "Milestone date must be between project start and end dates"),
    MILESTONE_NOT_FOUND("PROJ_004", HttpStatus.NOT_FOUND, "Milestone does not exist"),
    INVALID_ROLE_UTILIZATION("PROJ_005", HttpStatus.BAD_REQUEST, "Role utilization percentages must match timeline segments length"),
    PROJECT_ROLE_NOT_FOUND("PROJ_006", HttpStatus.NOT_FOUND, "Cannot find provided project role"),
    PROJECT_NOT_FOUND("PROJ_007", HttpStatus.NOT_FOUND, "Cannot find provided project"),
    ASSIGNMENT_INVALID_DATES("PROJ_008", HttpStatus.BAD_REQUEST, "Invalid dates for assignment"),

    ACTIVATION_TOKEN_NOT_FOUND("AUTH_001", HttpStatus.NOT_FOUND, "Activation token is invalid or does not exist"),
    ACTIVATION_TOKEN_EXPIRED("AUTH_002", HttpStatus.BAD_REQUEST, "Activation token has expired"),
    BAD_CREDENTIALS("AUTH_003", HttpStatus.UNAUTHORIZED, "Invalid email or password"),
    MISSING_REFRESH_TOKEN("AUTH_004", HttpStatus.UNAUTHORIZED, "Refresh token is missing or cookie expired"),
    INVALID_REFRESH_TOKEN("AUTH_005", HttpStatus.UNAUTHORIZED, "Refresh token is invalid"),
    INVALID_SUPERVISOR_ROLE("AUTH_006", HttpStatus.BAD_REQUEST, "Selected user cannot be a supervisor"),
    USER_NOT_PENDING("USR_002", HttpStatus.BAD_REQUEST, "Cannot resend invitation — user is not in PENDING status"),

    QUALIFICATION_NOT_FOUND("QUAL_001", HttpStatus.NOT_FOUND, "Qualification not found"),
    INVALID_QUALIFICATION_STATE("QUAL_002", HttpStatus.BAD_REQUEST, "Qualification is not in WAITING state"),
    QUALIFICATION_OWNER_NOT_SUBORDINATE("QUAL_003", HttpStatus.FORBIDDEN, "Qualification owner is not subordinate for manager"),

    NOTIFICATION_NOT_FOUND("NOTIF_001", HttpStatus.NOT_FOUND, "Notification not found"),

    ROLE_NOT_IN_PROJECT("REQ_001", HttpStatus.BAD_REQUEST, "Role must exist within the provided project"),
    USER_ALREADY_IN_PROJECT("REQ_002", HttpStatus.CONFLICT, "User is already a member of this project"),
    USER_HAS_ONGOING_REQUEST("REQ_003", HttpStatus.CONFLICT, "User already has a pending request for this project"),
    EMPLOYEE_REQUEST_NOT_FOUND("REQ_004", HttpStatus.NOT_FOUND, "Employee request not found"),
    INVALID_REQUEST_STATUS("REQ_005", HttpStatus.BAD_REQUEST, "Request is not in PENDING state"),

    INVALID_CURRENT_PASSWORD("USR_003", HttpStatus.UNAUTHORIZED, "Current password is incorrect"),
    PASSWORD_SAME_AS_CURRENT("USR_004", HttpStatus.BAD_REQUEST, "New password must be different from current password"),

    REPORT_GENERATION_ERROR("REP_001", HttpStatus.INTERNAL_SERVER_ERROR, "Wystąpił błąd podczas generowania raportu"),

    ACCESS_DENIED("GEN_002", HttpStatus.FORBIDDEN, "Access denied"),
    VALIDATION_FAILED("GEN_998", HttpStatus.BAD_REQUEST, "Validation failed"),
    INTERNAL_SERVER_ERROR("GEN_999", HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected internal server error");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
