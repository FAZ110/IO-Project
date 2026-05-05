package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.project_manager.domain.enums.GroupType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "project_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectGroups {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "description", length = 500, nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "group_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private GroupType groupType;

    @OneToMany(mappedBy = "projectGroup")
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    public void addProject(Project project) {
        this.projects.add(project);
        project.setProjectGroup(this);
    }
}
