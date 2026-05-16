package pl.edu.agh.project_manager.service.user;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.qualification.QualificationResponse;
import pl.edu.agh.project_manager.controller.dto.qualification.SkillSuggestion;
import pl.edu.agh.project_manager.domain.entity.user.Qualification;
import pl.edu.agh.project_manager.domain.entity.user.Skill;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import pl.edu.agh.project_manager.domain.event.QualificationRequestedEvent;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.user.QualificationRepository;
import pl.edu.agh.project_manager.repository.user.SkillRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QualificationService {
    private final QualificationRepository qualificationRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public List<QualificationResponse> addQualificationsToUser(UUID userId, List<String> skillNames, List<UUID> skillIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        List<Qualification> savedQualifications = new ArrayList<>();

        if (skillNames != null) {
            for (String skillName : skillNames) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                        .orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setName(skillName);
                            newSkill.setValid(false);
                            return skillRepository.save(newSkill);
                        });
                savedQualifications.add(saveQualification(user, skill));
            }
        }

        if (skillIds != null) {
            for (UUID skillId : skillIds) {
                Skill skill = skillRepository.findById(skillId)
                        .orElseThrow(() -> new ApplicationException(ApiErrorCode.QUALIFICATION_NOT_FOUND));
                savedQualifications.add(saveQualification(user, skill));
            }
        }

        if (user.getSupervisor() != null && !savedQualifications.isEmpty()) {
            List<String> skillsList = savedQualifications.stream()
                    .map(q -> q.getSkill().getName())
                    .toList();

            eventPublisher.publishEvent(new QualificationRequestedEvent(
                    user.getId(),
                    user.getSupervisor(),
                    user.getFullName(),
                    skillsList
            ));
        }

        return savedQualifications.stream()
                .map(q -> new QualificationResponse(q.getId(), q.getSkill().getName(), q.getStatus()))
                .toList();
    }

    private Qualification saveQualification(User user, Skill skill) {
        Qualification qualification = Qualification.builder()
                .user(user)
                .skill(skill)
                .status(QualificationStatus.WAITING)
                .build();
        user.addQualification(qualification);
        Qualification saved =  qualificationRepository.save(qualification);

        return saved;
    }

    public List<SkillSuggestion> searchSkills(String query) {
        return skillRepository
                .findByNameContainingIgnoreCase(query, PageRequest.of(0, 10))
                .stream()
                .map(s -> new SkillSuggestion(s.getId(), s.getName()))
                .toList();
    }

    @Transactional
    public void deleteQualification(UUID qualificationId, UUID userId) {
        Qualification qualification = qualificationRepository.findById(qualificationId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.QUALIFICATION_NOT_FOUND));

        if (!qualification.getUser().getId().equals(userId)) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED);
        }

        qualificationRepository.deleteById(qualificationId);
    }

    public List<QualificationResponse> getUserQualifications(UUID uuid) {
        List<Qualification> qualifications = qualificationRepository.findAllByUser_Id(uuid);
        return qualifications.stream()
                .map(q -> new QualificationResponse(q.getId(), q.getSkill().getName(), q.getStatus()))
                .toList();
    }
}