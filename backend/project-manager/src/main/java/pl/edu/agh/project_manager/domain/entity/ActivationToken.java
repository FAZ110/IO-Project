package pl.edu.agh.project_manager.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "activation_token")
public class ActivationToken {
    private static final int DAYS_ACTIVE = 3;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "token", nullable = false, unique = true, length = 36)
    private String token;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @PrePersist
    protected void onCreate() {
        if (this.token == null)
            this.token = UUID.randomUUID().toString();

        if (this.expiryDate == null)
            this.expiryDate = LocalDateTime.now().plusDays(DAYS_ACTIVE);
    }
}