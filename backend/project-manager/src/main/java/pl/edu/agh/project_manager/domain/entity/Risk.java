package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "risks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Risk {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @Column(name = "probability", nullable = false, columnDefinition = "integer check (Probability >= 0 and Probability <= 100)")
    @Min(value = 0, message = "Prawdopodobieństwo musi być większe bądź równe 0")
    @Max(value = 100, message = "Prawdopodobieństwo musi być mniejsze bądź równe 100")
    private Integer probability;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;
}
