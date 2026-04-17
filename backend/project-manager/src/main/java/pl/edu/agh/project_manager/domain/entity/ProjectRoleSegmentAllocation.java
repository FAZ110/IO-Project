package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(
        name = "project_role_segment_allocations",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"project_role_id", "segment_id"})
        }
)
public class ProjectRoleSegmentAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_role_id", nullable = false)
    private ProjectRole projectRole;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "segment_id", nullable = false)
    private ProjectSegment segment;

    @Column(name = "utilization_percentage", nullable = false, columnDefinition = "integer check (utilization_percentage >= 0 and utilization_percentage <= 100)")
    @Min(value = 0, message = "Wykorzystanie roli musi być większe bądź równe 0")
    @Max(value = 100, message = "Wykorzystanie roli musi być mniejsze bądź równe 100")
    private Integer utilizationPercentage;
}

