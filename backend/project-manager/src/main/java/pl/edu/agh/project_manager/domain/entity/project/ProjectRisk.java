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

    @Column(name = "probability", nullable = false, columnDefinition = "integer check (probability >= 1 and probability <= 5)")
    @Min(value = 1, message = "Prawdopodobieństwo musi być w skali od 1 do 5")
    @Max(value = 5, message = "Prawdopodobieństwo musi być w skali od 1 do 5")
    private Integer probability;

    @Column(name = "impact", nullable = false, columnDefinition = "integer check (impact >= 1 and impact <= 5)")
    @Min(value = 1, message = "Wpływ musi być w skali od 1 do 5")
    @Max(value = 5, message = "Wpływ musi być w skali od 1 do 5")
    private Integer impact;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}