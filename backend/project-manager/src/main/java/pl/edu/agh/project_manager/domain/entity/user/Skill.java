package pl.edu.agh.project_manager.domain.entity.user;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Builder.Default
    @Column(name = "is_valid", nullable = false)
    private boolean valid = false;
}