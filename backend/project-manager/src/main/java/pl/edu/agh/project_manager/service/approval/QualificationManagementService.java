package pl.edu.agh.project_manager.service.approval;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.approvals.QualificationDetailsResponse;
import pl.edu.agh.project_manager.controller.dto.approvals.QualificationRequestResponse;
import pl.edu.agh.project_manager.controller.dto.approvals.QualificationUpdateAction;
import pl.edu.agh.project_manager.controller.dto.approvals.QualificationUpdateRequest;
import pl.edu.agh.project_manager.domain.entity.user.Qualification;
import pl.edu.agh.project_manager.domain.entity.user.Skill;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.user.QualificationRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QualificationManagementService {
    private final QualificationRepository qualificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<QualificationRequestResponse> getRecordsForManager(UUID managerId) {
        List<Qualification> qualifications = qualificationRepository.findAllByUserSupervisorIdAndStatus(managerId, QualificationStatus.WAITING);

        return qualifications.stream()
                .collect(Collectors.groupingBy(Qualification::getUser))
                .entrySet().stream()
                .map(entry -> {
                    User user = entry.getKey();
                    int count = entry.getValue().size();

                    return new QualificationRequestResponse(
                            user.getId(),
                            user.getName(),
                            user.getSurname(),
                            count
                    );
                })
                .toList();
    }

    @Transactional
    public void updateRequests(UUID managerId, List<QualificationUpdateRequest> requests) {
        var activeRequestsMap = requests.stream()
                .collect(Collectors.toMap(QualificationUpdateRequest::qualificationId, r -> r));

        if (activeRequestsMap.isEmpty()) return;

        List<UUID> ids = List.copyOf(activeRequestsMap.keySet());

        List<Qualification> allowedQualifications = qualificationRepository.findAllByIdInAndUserSupervisorId(ids, managerId);

        if (allowedQualifications.size() != ids.size()) {
            throw new ApplicationException(ApiErrorCode.QUALIFICATION_OWNER_NOT_SUBORDINATE);
        }

        for (Qualification qualification : allowedQualifications) {
            validateWaitingStatus(qualification);

            var action = activeRequestsMap.get(qualification.getId()).action();

            switch (action) {
                case QualificationUpdateAction.ACCEPT -> qualification.accept();
                case QualificationUpdateAction.REJECT -> qualification.reject();
            }
        }
    }

    @Transactional(readOnly = true)
    public List<QualificationDetailsResponse> getPendingForUser(UUID managerId, UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ApplicationException(ApiErrorCode.USER_NOT_FOUND);
        }

        return qualificationRepository.findAllByUserIdAndStatus(userId, QualificationStatus.WAITING)
                .stream()
                .map(QualificationDetailsResponse::from)
                .toList();
    }

    private void validateWaitingStatus(Qualification qualification) {
        if (qualification.getStatus() != QualificationStatus.WAITING) {
            throw new ApplicationException(ApiErrorCode.INVALID_QUALIFICATION_STATE);
        }
    }
}
