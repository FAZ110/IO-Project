package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.project_manager.domain.entity.project.ProjectMilestone;
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

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private ProjectGroups projectGroup;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_manager_id", nullable = false)
    private User projectManager;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectRisk> risks = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ProjectMember> members = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectRole> roles = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectSegment> segments = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectMilestone> milestones = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "project_sponsors",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> sponsors = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "project_committees",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> committees = new HashSet<>();

    public void addRisk(ProjectRisk risk) {
        this.risks.add(risk);
        risk.setProject(this);
    }

    public void removeRisk(ProjectRisk risk) {
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

    public void addMilestone(ProjectMilestone milestone) {
        this.milestones.add(milestone);
        milestone.setProject(this);
    }

    public void addSegment(ProjectSegment projectSegment) {
        this.segments.add(projectSegment);
        projectSegment.setProject(this);
    }

    public void addRole(ProjectRole role) {
        this.roles.add(role);
        role.setProject(this);
    }

    public void addSponsor(User sponsor) {
        this.sponsors.add(sponsor);
        sponsor.getSponsorProjects().add(this);
    }

    public void addCommittee(User committee) {
        this.committees.add(committee);
        committee.getCommitteeProjects().add(this);
    }
}
