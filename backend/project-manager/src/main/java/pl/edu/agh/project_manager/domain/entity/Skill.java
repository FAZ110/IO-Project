package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "is_valid")
    private Boolean isValid = true;
}