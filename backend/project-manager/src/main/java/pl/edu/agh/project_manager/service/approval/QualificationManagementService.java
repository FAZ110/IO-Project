package pl.edu.agh.project_manager.service.approval;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
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
import pl.edu.agh.project_manager.domain.event.NotificationEvent;
import pl.edu.agh.project_manager.domain.event.QualificationAcceptedEvent;
import pl.edu.agh.project_manager.domain.event.QualificationRejectedEvent;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.user.QualificationRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;
import pl.edu.agh.project_manager.service.notification.NotificationSender;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QualificationManagementService {
    private final QualificationRepository qualificationRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

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

        Map<User, List<String>> acceptedSkillsByUser = new HashMap<>();
        Map<User, List<String>> rejectedSkillsByUser = new HashMap<>();

        for (Qualification qualification : allowedQualifications) {
            validateWaitingStatus(qualification);

            User owner = qualification.getUser();
            var action = activeRequestsMap.get(qualification.getId()).action();
            String skillName = qualification.getSkill().getName();

            switch (action) {
                case ACCEPT -> {
                    qualification.accept();
                    acceptedSkillsByUser.computeIfAbsent(owner, k -> new ArrayList<>()).add(skillName);
                }
                case REJECT -> {
                    qualification.reject();
                    rejectedSkillsByUser.computeIfAbsent(owner, k -> new ArrayList<>()).add(skillName);
                }
            }
        }

        acceptedSkillsByUser.forEach((user, skills) -> {
            String skillsJoined = String.join(", ", skills);
            eventPublisher.publishEvent(new QualificationAcceptedEvent(
                    user.getId(),
                    user,
                    "Zatwierdzono Twoje kwalifikacje: " + skillsJoined
            ));
        });

        rejectedSkillsByUser.forEach((user, skills) -> {
            String skillsJoined = String.join(", ", skills);
            eventPublisher.publishEvent(new QualificationRejectedEvent(
                    user.getId(),
                    user,
                    "Odrzucono wnioski o kwalifikacje: " + skillsJoined
            ));
        });
    }

    @Transactional(readOnly = true)
    public List<QualificationDetailsResponse> getPendingForUser(UUID userId) {
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
