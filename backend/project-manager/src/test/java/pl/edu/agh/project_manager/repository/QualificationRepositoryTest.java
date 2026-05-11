package pl.edu.agh.project_manager.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import pl.edu.agh.project_manager.domain.entity.user.Qualification;
import pl.edu.agh.project_manager.domain.entity.user.Skill;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.repository.user.QualificationRepository;
import pl.edu.agh.project_manager.repository.user.SkillRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DataJpaTest
class QualificationRepositoryTest {

    @Autowired
    private QualificationRepository qualificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Test
    void shouldFindAllQualificationsByUserId() {
        User user = User.builder()
                .email("test@agh.edu.pl")
                .name("Jan")
                .surname("Kowalski")
                .password("zakodowane_haslo")
                .userRole(UserRole.COMMON)
                .userStatus(UserStatus.ACTIVE)
                .build();
        user = userRepository.save(user);

        Skill skill = Skill.builder()
                .name("Java")
                .valid(true)
                .build();
        skill = skillRepository.save(skill);

        Qualification q1 = Qualification.builder()
                .skill(skill)
                .status(QualificationStatus.ACCEPTED)
                .build();

        user.addQualification(q1);
        qualificationRepository.save(q1);

        List<Qualification> result = qualificationRepository.findAllByUser_Id(user.getId());

        assertEquals(1, result.size());
        assertEquals(user.getId(), result.get(0).getUser().getId());
    }
}