package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.project_manager.domain.entity.Skill;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;

@Entity
@Table(name = "qualification")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Qualification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Zakładam, że masz już klasę User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Enumerated(EnumType.STRING)
    private QualificationStatus status = QualificationStatus.WAITING; // Domyślnie oczekuje na zatwierdzenie
}