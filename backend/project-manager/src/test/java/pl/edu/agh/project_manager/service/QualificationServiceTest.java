package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.agh.project_manager.domain.entity.Qualification;
import pl.edu.agh.project_manager.domain.entity.Skill;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import pl.edu.agh.project_manager.repository.QualificationRepository;
import pl.edu.agh.project_manager.repository.SkillRepository;
import pl.edu.agh.project_manager.repository.UserRepository;

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
    void shouldAddQualificationToUser_WhenSkillExists() {
        UUID userId = UUID.randomUUID();
        String skillName = "Java";

        User mockUser = new User();
        mockUser.setId(userId);

        Skill mockSkill = new Skill();
        mockSkill.setName(skillName);

        Qualification mockSavedQualification = new Qualification();
        mockSavedQualification.setId(1L);
        mockSavedQualification.setUser(mockUser);
        mockSavedQualification.setSkill(mockSkill);
        mockSavedQualification.setStatus(QualificationStatus.WAITING);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(skillRepository.findByNameIgnoreCase(skillName)).thenReturn(Optional.of(mockSkill));
        when(qualificationRepository.save(any(Qualification.class))).thenReturn(mockSavedQualification);

        var response = qualificationService.addQualificationToUser(userId, skillName);

        assertNotNull(response);
        assertEquals("Java", response.name());
        assertEquals(QualificationStatus.WAITING, response.status());

        verify(qualificationRepository, times(1)).save(any(Qualification.class));
    }
}