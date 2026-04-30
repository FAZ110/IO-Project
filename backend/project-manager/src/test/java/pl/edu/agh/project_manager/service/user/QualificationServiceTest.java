package pl.edu.agh.project_manager.service.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.domain.entity.user.Qualification;
import pl.edu.agh.project_manager.domain.entity.user.Skill;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import pl.edu.agh.project_manager.repository.user.QualificationRepository;
import pl.edu.agh.project_manager.repository.user.SkillRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QualificationServiceTest {

    @Mock
    private QualificationRepository qualificationRepository;
    @Mock
    private SkillRepository skillRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private QualificationService qualificationService;

    @Test
    void shouldAddQualificationsToUser_WhenSkillExists() {
        UUID userId = UUID.randomUUID();
        String skillName = "Java";
        List<String> skillsToAdd = List.of(skillName);

        User mockUser = User.builder().id(userId).build();
        Skill mockSkill = Skill.builder().id(UUID.randomUUID()).name(skillName).valid(true).build();

        Qualification mockSavedQualification = Qualification.builder()
                .id(UUID.randomUUID())
                .user(mockUser)
                .skill(mockSkill)
                .status(QualificationStatus.WAITING)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(skillRepository.findByNameIgnoreCase(skillName)).thenReturn(Optional.of(mockSkill));
        when(qualificationRepository.save(any(Qualification.class))).thenReturn(mockSavedQualification);

        var responseList = qualificationService.addQualificationsToUser(userId, skillsToAdd, List.of());

        assertNotNull(responseList);
        assertEquals(1, responseList.size(), "Lista powinna zawierać dokładnie jeden dodany element");
        assertEquals("Java", responseList.get(0).name());
        assertEquals(QualificationStatus.WAITING, responseList.get(0).status());

        verify(qualificationRepository, times(1)).save(any(Qualification.class));
    }
}