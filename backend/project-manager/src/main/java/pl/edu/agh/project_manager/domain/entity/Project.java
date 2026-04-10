package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
    @Column(name = "ID", nullable = false)
    private UUID id;

    @Column(name = "Title", length = 100, nullable = false)
    private String title;

    @Column(name = "Description", length = 500, nullable = false)
    private String description;

    @Column(name = "Start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "Is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "Wallet_ID")
    private Integer walletId;

    @Column(name = "Program_ID")
    private Integer programId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Procjet_Manager_ID")
    private User projectManagerUser;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Risk> risks = new ArrayList<>();
}
