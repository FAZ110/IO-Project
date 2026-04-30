package pl.edu.agh.project_manager.service.project;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.project.AssignmentResponse;
import pl.edu.agh.project_manager.domain.entity.Project;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.project.ProjectAssignmentRepository;
import pl.edu.agh.project_manager.service.ProjectService;
import pl.edu.agh.project_manager.service.UserService;
import pl.edu.agh.project_manager.service.command.project.AssignmentCommand;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectAssignmentServiceTest {

    @Mock
    private ProjectService projectService;
    @Mock
    private UserService userService;
    @Mock
    private ProjectAssignmentRepository assignmentRepository;

    @InjectMocks
    private ProjectAssignmentService assignmentService;

    @Test
    @DisplayName("Should successfully create a project assignment")
    void createAssignment_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        AssignmentCommand command = new AssignmentCommand(
                userId, "Developer", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 8, 1), 50
        );

        Project project = Project.builder()
                .id(projectId)
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .build();
        User user = User.builder().id(userId).build();

        ProjectAssignment savedAssignment = ProjectAssignment.builder()
                .id(UUID.randomUUID())
                .project(project)
                .user(user)
                .status(AssignmentStatus.PENDING)
                .build();

        when(projectService.getProjectEntityOrThrow(projectId)).thenReturn(project);
        when(userService.getUserEntityOrThrow(userId)).thenReturn(user);
        when(assignmentRepository.save(any(ProjectAssignment.class))).thenReturn(savedAssignment);

        // When
        AssignmentResponse response = assignmentService.createAssignment(projectId, command);

        // Then
        assertThat(response).isNotNull();
        verify(assignmentRepository).save(any(ProjectAssignment.class));
        verify(projectService).getProjectEntityOrThrow(projectId);
    }

    @Test
    @DisplayName("Should throw exception when assignment dates are outside project dates")
    void createAssignment_DatesOutOfRange() {
        // Given
        UUID projectId = UUID.randomUUID();
        AssignmentCommand command = new AssignmentCommand(
                UUID.randomUUID(), "Developer", LocalDate.of(2025, 1, 1), LocalDate.of(2026, 8, 1), 50
        );

        Project project = Project.builder()
                .id(projectId)
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .build();

        when(projectService.getProjectEntityOrThrow(projectId)).thenReturn(project);

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> assignmentService.createAssignment(projectId, command))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.VALIDATION_ERROR);

        verify(assignmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully delete a pending assignment")
    void deleteAssignment_Success() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID assignmentId = UUID.randomUUID();
        Project project = Project.builder().id(projectId).build();
        ProjectAssignment assignment = ProjectAssignment.builder()
                .id(assignmentId)
                .project(project)
                .status(AssignmentStatus.PENDING)
                .build();

        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));

        // When
        assignmentService.deleteAssignment(projectId, assignmentId);

        // Then
        verify(assignmentRepository).delete(assignment);
    }

    @Test
    @DisplayName("Should throw exception when trying to delete non-pending assignment")
    void deleteAssignment_NotPending() {
        // Given
        UUID projectId = UUID.randomUUID();
        UUID assignmentId = UUID.randomUUID();
        Project project = Project.builder().id(projectId).build();
        ProjectAssignment assignment = ProjectAssignment.builder()
                .id(assignmentId)
                .project(project)
                .status(AssignmentStatus.ACCEPTED)
                .build();

        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> assignmentService.deleteAssignment(projectId, assignmentId))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.INVALID_REQUEST_STATUS);

        verify(assignmentRepository, never()).delete(any());
    }
}