package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "project_roles")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRole {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "role_name", nullable = false)
    private String roleName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "projectRole", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectRoleSegmentAllocation> segmentAllocations = new ArrayList<>();
}