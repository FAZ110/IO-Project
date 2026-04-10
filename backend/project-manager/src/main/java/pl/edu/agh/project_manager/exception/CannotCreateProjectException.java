package pl.edu.agh.project_manager.exception;

public class CannotCreateProjectException extends RuntimeException {
    public CannotCreateProjectException(String message) {
        super(message);
    }
}
