package pl.edu.agh.project_manager.domain.entity.user;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import java.util.UUID;

@Entity
@Table(name = "qualifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Qualification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private QualificationStatus status = QualificationStatus.WAITING;

    public void accept() {
        this.status = QualificationStatus.ACCEPTED;
        if (!skill.isValid()) {
            skill.setValid(true);
        }
    }

    public void reject() {
        this.status = QualificationStatus.REJECTED;
    }
}