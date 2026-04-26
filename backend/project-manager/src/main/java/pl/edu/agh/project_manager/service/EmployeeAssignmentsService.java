package pl.edu.agh.project_manager.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.employee_requests.ChartIntervalResponse;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentResponse;
import pl.edu.agh.project_manager.controller.dto.employee_requests.EmployeeAssignmentRequestStatus;
import pl.edu.agh.project_manager.domain.entity.*;
import pl.edu.agh.project_manager.domain.enums.MembershipStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.*;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestCommand;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestDetailsCommand;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class EmployeeAssignmentsService {
    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final ProjectRoleRepository projectRoleRepository;

    private final ProjectMemberRepository projectMemberRepository;

    private final ProjectRoleSegmentAllocationRepository segmentAllocationRepository;

    @Transactional
    public void createEmployeeAssignment(EmployeeRequestCommand command) {
        User employee = userRepository.findById(command.userId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        Project project = projectRepository.findById(command.projectId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_NOT_FOUND));

        ProjectRole role = projectRoleRepository.findById(command.roleId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.PROJECT_ROLE_NOT_FOUND));

        if (!role.getProject().getId().equals(command.projectId())) {
            throw new ApplicationException(ApiErrorCode.ROLE_NOT_IN_PROJECT);
        }

        if (projectMemberRepository.existsByUserIdAndProjectIdAndMembershipStatus(command.userId(), command.projectId(), MembershipStatus.PENDING)) {
            throw new ApplicationException(ApiErrorCode.USER_HAS_ONGOING_REQUEST);
        }

        if (projectMemberRepository.existsByUserIdAndProjectIdAndMembershipStatus(command.userId(), command.projectId(), MembershipStatus.ACCEPTED)) {
            throw new ApplicationException(ApiErrorCode.USER_ALREADY_IN_PROJECT);
        }

        ProjectMember member = ProjectMember
                .builder()
                .membershipStatus(MembershipStatus.PENDING)
                .user(employee)
                .project(project)
                .role(role)
                .build();

        projectMemberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public List<EmployeeAssignmentResponse> getEmployeeAssignments(EmployeeAssignmentRequestStatus status) {
        List<ProjectMember> members = status == null
                ? projectMemberRepository.findAllWithDetails()
                : projectMemberRepository.findAllWithDetailsByMembershipStatus(mapToMembershipStatus(status));

        return members.stream()
                .map(member -> {
                    var project = member.getProject();
                    var user = member.getUser();
                    var requestStatus = switch (member.getMembershipStatus()) {
                        case PENDING -> EmployeeAssignmentRequestStatus.PENDING;
                        case ACCEPTED -> EmployeeAssignmentRequestStatus.ACCEPTED;
                        case REJECTED -> EmployeeAssignmentRequestStatus.REJECTED;
                    };

                    return new EmployeeAssignmentResponse(
                            project.getTitle(),
                            project.getId(),
                            member.getRole().getRoleName(),
                            user.getName(),
                            user.getSurname(),
                            requestStatus,
                            member.getCreatedAt()
                    );
                })
                .toList();
    }

    private MembershipStatus mapToMembershipStatus(EmployeeAssignmentRequestStatus status) {
        return switch (status) {
            case PENDING -> MembershipStatus.PENDING;
            case ACCEPTED -> MembershipStatus.ACCEPTED;
            case REJECTED -> MembershipStatus.REJECTED;
        };
    }

    @Transactional
    public void acceptEmployeeAssignment(UUID requestId) {
        ProjectMember projectRequest = projectMemberRepository.findById(requestId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND));

        // TODO: zarówno tutaj jak i ponizej trzeba sprawdzic
        //  czy uzytkownik akceptujacy wniosek jest supervisorem

        validatePendingStatus(projectRequest);

        projectRequest.setMembershipStatus(MembershipStatus.ACCEPTED);
    }

    @Transactional
    public void rejectEmployeeAssignment(UUID requestId) {
        ProjectMember projectRequest = projectMemberRepository.findById(requestId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND));

        validatePendingStatus(projectRequest);

        projectRequest.setMembershipStatus(MembershipStatus.REJECTED);
    }

    private void validatePendingStatus(ProjectMember request) {
        if (request.getMembershipStatus() != MembershipStatus.PENDING) {
            throw new ApplicationException(ApiErrorCode.INVALID_REQUEST_STATUS);
        }
    }

    @Transactional(readOnly = true)
    public EmployeeAssignmentDetailsResponse getEmployeeRequestDetails(EmployeeRequestDetailsCommand command) {
        ProjectMember projectRequest = projectMemberRepository.findById(command.requestId())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.EMPLOYEE_REQUEST_NOT_FOUND));

        return new EmployeeAssignmentDetailsResponse(
                calculateAggregatedWorkload(projectRequest.getUser().getId()),
                getRequestIncrement(projectRequest)
        );
    }

    private List<ChartIntervalResponse> calculateAggregatedWorkload(UUID userId) {
        List<ProjectRoleSegmentAllocation> allocations = segmentAllocationRepository.findAllUserAllocations(userId);

        if (allocations.isEmpty()) return List.of();

        return generateWorkloadSteps(allocations);
    }

    private List<ChartIntervalResponse> getRequestIncrement(ProjectMember request) {
        return generateWorkloadSteps(request.getRole().getSegmentAllocations());
    }

    private List<ChartIntervalResponse> generateWorkloadSteps(List<ProjectRoleSegmentAllocation> segmentAllocations) {
        List<RawAllocation> rawAllocations = flattenAllocations(segmentAllocations);

        if (rawAllocations.isEmpty()) return List.of();

        List<LocalDate> timeline = rawAllocations.stream()
                .flatMap(a -> Stream.of(a.start(), a.end()))
                .distinct()
                .sorted()
                .toList();

        List<ChartIntervalResponse> steps = new ArrayList<>();

        for (int i = 0; i < timeline.size() - 1; i++) {
            LocalDate start = timeline.get(i);
            LocalDate end = timeline.get(i + 1);

            int totalPercent = rawAllocations.stream()
                    .filter(a -> !a.start().isAfter(start) && !a.end().isBefore(end))
                    .mapToInt(RawAllocation::percent)
                    .sum();

            steps.add(new ChartIntervalResponse(start, end, totalPercent));
        }

        return mergeContinuousSteps(steps);
    }

    private List<RawAllocation> flattenAllocations(List<ProjectRoleSegmentAllocation> allocations) {
        return allocations.stream()
                .map(a -> new RawAllocation(
                        a.getSegment().getStartDate(),
                        a.getSegment().getEndDate(),
                        a.getUtilizationPercentage()
                ))
                .toList();
    }

    private List<ChartIntervalResponse> mergeContinuousSteps(List<ChartIntervalResponse> steps) {
        if (steps.size() < 2) return steps;

        List<ChartIntervalResponse> merged = new ArrayList<>();
        ChartIntervalResponse current = steps.getFirst();

        for (int i = 1; i < steps.size(); i++) {
            ChartIntervalResponse next = steps.get(i);

            if (current.percentage() == next.percentage()) {
                current = new ChartIntervalResponse(current.startDate(), next.endDate(), current.percentage());
            } else {
                merged.add(current);
                current = next;
            }
        }
        merged.add(current);

        return merged;
    }

    private record RawAllocation(LocalDate start, LocalDate end, int percent) {}
}
