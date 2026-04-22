package pl.edu.agh.project_manager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.qualification.QualificationResponse;
import pl.edu.agh.project_manager.domain.entity.Qualification;
import pl.edu.agh.project_manager.domain.entity.Skill;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.QualificationRepository;
import pl.edu.agh.project_manager.repository.SkillRepository;
import pl.edu.agh.project_manager.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QualificationService {
    private final QualificationRepository qualificationRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<QualificationResponse> addQualificationsToUser(UUID userId, Set<String> skillNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.USER_NOT_FOUND));

        List<Qualification> savedQualifications = new ArrayList<>();

        for (String skillName : skillNames) {
            Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                    .orElseGet(() -> {
                        Skill newSkill = new Skill();
                        newSkill.setName(skillName);
                        newSkill.setValid(false);
                        return skillRepository.save(newSkill);
                    });

            Qualification qualification = Qualification.builder()
                    .user(user)
                    .skill(skill)
                    .status(QualificationStatus.WAITING)
                    .build();

            user.addQualification(qualification);
            savedQualifications.add(qualificationRepository.save(qualification));
        }

        return savedQualifications.stream()
                .map(q -> new QualificationResponse(q.getId(), q.getSkill().getName(), q.getStatus()))
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
        List<Qualification> qualifications = qualificationRepository.findAllByUserId(uuid);
        return qualifications.stream()
                .map(q -> new QualificationResponse(q.getId(), q.getSkill().getName(), q.getStatus()))
                .toList();
    }
}