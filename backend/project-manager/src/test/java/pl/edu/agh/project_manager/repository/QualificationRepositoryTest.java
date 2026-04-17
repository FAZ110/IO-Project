package pl.edu.agh.project_manager.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import pl.edu.agh.project_manager.domain.entity.Qualification;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class QualificationRepositoryTest {

    @Autowired
    private QualificationRepository qualificationRepository;

    @Autowired
    private UserRepository userRepository;

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
        user = userRepository.save(user);

        Qualification q1 = new Qualification();
        q1.setUser(user);
        qualificationRepository.save(q1);

        List<Qualification> result = qualificationRepository.findAllByUserId(user.getId());

        assertEquals(1, result.size());
        assertEquals(user.getId(), result.get(0).getUser().getId());
    }
}