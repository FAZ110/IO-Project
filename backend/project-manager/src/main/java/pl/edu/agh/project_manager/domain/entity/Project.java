package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.project_manager.domain.enums.MembershipStatus;

import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "description", length = 500, nullable = false)
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "wallet_id")
    private Integer walletId;

    @Column(name = "program_id")
    private Integer programId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_manager_id", nullable = false)
    private User projectManager;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectRisk> risks = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectRole> roles = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectSegment> segments = new ArrayList<>();

    public void addRisk(ProjectRisk risk) {
        this.risks.add(risk);
        risk.setProject(this);
    }

    public void removeRisk(Risk risk) {
        this.risks.remove(risk);
        risk.setProject(null);
    }

    public void removeRisk(Risk risk) {
        this.risks.remove(risk);
        risk.setProject(null);
    }

    public void addMember(User user, ProjectRole role) {
        ProjectMember member = new ProjectMember();
        member.setProject(this);
        member.setUser(user);
        member.setRole(role);
        member.setMembershipStatus(MembershipStatus.PENDING);
        this.members.add(member);
    }
}
