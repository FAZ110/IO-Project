package pl.edu.agh.project_manager.service.approval;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.controller.dto.common.ChartIntervalResponse;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentDetailsResponse;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.service.project.ProjectAssignmentService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssignmentManagementServiceTest {

    @Mock
    private ProjectAssignmentService projectAssignmentService;

    @InjectMocks
    private AssignmentManagementService assignmentManagementService;

    @Test
    @DisplayName("Should throw exception when assignment is not found")
    void getEmployeeRequestDetails_NotFound() {
        // Given
        UUID assignmentId = UUID.randomUUID();
        when(projectAssignmentService.getAssignmentOrThrow(assignmentId))
                .thenThrow(new ApplicationException(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND));

        // When & Then
        assertThatExceptionOfType(ApplicationException.class)
                .isThrownBy(() -> assignmentManagementService.getEmployeeRequestDetails(assignmentId))
                .extracting(ApplicationException::getErrorCode)
                .isEqualTo(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND);
    }

    @Test
    @DisplayName("Should calculate workload and handle overlapping assignments correctly")
    void getEmployeeRequestDetails_SuccessWithOverlaps() {
        // Given
        UUID assignmentId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        ProjectAssignment requestedAssignment = createAssignment(
                assignmentId, userId, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 15), 30
        );

        ProjectAssignment current1 = createAssignment(
                UUID.randomUUID(), userId, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 10), 40
        );

        ProjectAssignment current2 = createAssignment(
                UUID.randomUUID(), userId, LocalDate.of(2026, 1, 5), LocalDate.of(2026, 1, 15), 30
        );

        when(projectAssignmentService.getAssignmentOrThrow(assignmentId)).thenReturn(requestedAssignment);
        when(projectAssignmentService.getAcceptedAssignmentsForUser(userId)).thenReturn(List.of(current1, current2));

        // When
        EmployeeAssignmentDetailsResponse response = assignmentManagementService.getEmployeeRequestDetails(assignmentId);

        // Then
        assertThat(response.requestedWorkload()).hasSize(1);
        assertThat(response.requestedWorkload().getFirst())
                .extracting(ChartIntervalResponse::percentage)
                .isEqualTo(30);

        List<ChartIntervalResponse> currentWorkload = response.currentWorkload();
        assertThat(currentWorkload).hasSize(3);

        assertThat(currentWorkload.get(0).percentage()).isEqualTo(40);
        assertThat(currentWorkload.get(0).startDate()).isEqualTo(LocalDate.of(2026, 1, 1));
        assertThat(currentWorkload.get(0).endDate()).isEqualTo(LocalDate.of(2026, 1, 5));

        assertThat(currentWorkload.get(1).percentage()).isEqualTo(70);
        assertThat(currentWorkload.get(1).startDate()).isEqualTo(LocalDate.of(2026, 1, 5));

        assertThat(currentWorkload.get(2).percentage()).isEqualTo(30);
        assertThat(currentWorkload.get(2).startDate()).isEqualTo(LocalDate.of(2026, 1, 10));
        assertThat(currentWorkload.get(2).endDate()).isEqualTo(LocalDate.of(2026, 1, 15));
    }

    @Test
    @DisplayName("Should merge continuous intervals and NOT merge gaps")
    void getEmployeeRequestDetails_GapHandling() {
        // Given
        UUID assignmentId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        ProjectAssignment requestedAssignment = createAssignment(
                assignmentId, userId, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 10), 10
        );

        ProjectAssignment current1 = createAssignment(
                UUID.randomUUID(), userId, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 31), 50
        );
        ProjectAssignment current2 = createAssignment(
                UUID.randomUUID(), userId, LocalDate.of(2026, 3, 1), LocalDate.of(2026, 3, 31), 50
        );
        ProjectAssignment current3 = createAssignment(
                UUID.randomUUID(), userId, LocalDate.of(2026, 3, 31), LocalDate.of(2026, 4, 30), 50
        );

        when(projectAssignmentService.getAssignmentOrThrow(assignmentId)).thenReturn(requestedAssignment);
        when(projectAssignmentService.getAcceptedAssignmentsForUser(userId)).thenReturn(List.of(current1, current2, current3));

        // When
        EmployeeAssignmentDetailsResponse response = assignmentManagementService.getEmployeeRequestDetails(assignmentId);

        // Then
        List<ChartIntervalResponse> currentWorkload = response.currentWorkload();

        assertThat(currentWorkload).hasSize(2);

        assertThat(currentWorkload.get(0).percentage()).isEqualTo(50);
        assertThat(currentWorkload.get(0).startDate()).isEqualTo(LocalDate.of(2026, 1, 1));
        assertThat(currentWorkload.get(0).endDate()).isEqualTo(LocalDate.of(2026, 1, 31));

        assertThat(currentWorkload.get(1).percentage()).isEqualTo(50);
        assertThat(currentWorkload.get(1).startDate()).isEqualTo(LocalDate.of(2026, 3, 1));
        assertThat(currentWorkload.get(1).endDate()).isEqualTo(LocalDate.of(2026, 4, 30));
    }

    private ProjectAssignment createAssignment(UUID id, UUID userId, LocalDate start, LocalDate end, int percentage) {
        return ProjectAssignment.builder()
                .id(id)
                .user(User.builder().id(userId).build())
                .startDate(start)
                .endDate(end)
                .utilizationPercentage(percentage)
                .build();
    }
}