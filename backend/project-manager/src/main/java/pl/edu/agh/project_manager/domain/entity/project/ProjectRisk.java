package pl.edu.agh.project_manager.domain.entity.project;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "project_risks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRisk {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    // TODO: Przejscie na model od 1 do 5 w skali prawdopodobienstwa wystapienia i skali ryzyka dla projektu
    @Column(name = "probability", nullable = false, columnDefinition = "integer check (probability >= 0 and probability <= 100)")
    @Min(value = 0, message = "Prawdopodobieństwo musi być większe bądź równe 0")
    @Max(value = 100, message = "Prawdopodobieństwo musi być mniejsze bądź równe 100")
    private Integer probability;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}
