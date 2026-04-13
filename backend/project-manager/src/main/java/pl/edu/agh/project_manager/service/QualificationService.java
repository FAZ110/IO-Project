package pl.edu.agh.project_manager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.controller.dto.qualification.QualificationResponse;
import pl.edu.agh.project_manager.domain.entity.Qualification;
import pl.edu.agh.project_manager.domain.entity.Skill;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import pl.edu.agh.project_manager.repository.QualificationRepository;
import pl.edu.agh.project_manager.repository.SkillRepository;
import pl.edu.agh.project_manager.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QualificationService {
    private final QualificationRepository qualificationRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    @Transactional
    public QualificationResponse addQualificationToUser(UUID userId, String skillName) {
        User user = userRepository.findById(userId).orElseThrow();

        Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(skillName);
                    newSkill.setIsValid(true);
                    return skillRepository.save(newSkill);
                });

        Qualification qualification = new Qualification();
        qualification.setUser(user);
        qualification.setSkill(skill);
        qualification.setStatus(QualificationStatus.WAITING);

        Qualification savedQualification = qualificationRepository.save(qualification);

        return new QualificationResponse(
                savedQualification.getId(),
                savedQualification.getSkill().getName(),
                savedQualification.getStatus()
        );
    }

    @Transactional
    public void deleteQualification(Long qualificationId, UUID userId) {
        Qualification qualification = qualificationRepository.findById(qualificationId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono kwalifikacji"));

        if (!qualification.getUser().getId().equals(userId)) {
            throw new SecurityException("Brak uprawnień do usunięcia tego certyfikatu");
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