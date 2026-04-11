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
    @Column(name = "ID", nullable = false)
    private UUID ID;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Description", nullable = false, length = 500)
    private String description;

    @Column(name = "Probability", nullable = false, columnDefinition = "integer check (Probability >= 0 and Probability <= 100)")
    @Min(value = 0, message = "Prawdopodobieństwo musi być większa od 0")
    @Max(value = 100, message = "Prawdopodobieństwo nie może przekraczać 100")
    private Integer probability;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Project_ID")
    private Project project;
}
