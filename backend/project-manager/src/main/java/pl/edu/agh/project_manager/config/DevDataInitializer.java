package pl.edu.agh.project_manager.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.repository.user.UserRepository;

@Configuration
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DevDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.admin.username}")
    private String adminUsername;
    @Value("${application.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        log.info("Checking and initializing DEV users...");

        String defaultPassword = passwordEncoder.encode("password123");

        // ADMIN
        createUserIfNotExists(
                adminUsername,
                passwordEncoder.encode(adminPassword),
                "Super",
                "Admin",
                UserRole.ADMINISTRATOR
        );

        // PROJECT MANAGER
        createUserIfNotExists(
                "pm@dev.com",
                defaultPassword,
                "Anna",
                "Manager",
                UserRole.PROJECT_MANAGER
        );

        // LINEAR MANAGER
        User linearManager = createUserIfNotExists(
                "linear@dev.com",
                defaultPassword,
                "Piotr",
                "Liniowy",
                UserRole.LINEAR_MANAGER
        );

        // AUTHORITY
        createUserIfNotExists(
                "authority@dev.com",
                defaultPassword,
                "Jan",
                "Władza",
                UserRole.AUTHORITY
        );

        // COMMON
        createUserIfNotExists(
                "common@dev.com",
                defaultPassword,
                "Maciej",
                "Pracownik",
                UserRole.COMMON,
                linearManager
        );

        log.info("DEV users initialization completed.");
    }

    private User createUserIfNotExists(String email, String encodedPassword, String name, String surname, UserRole role) {
        return createUserIfNotExists(email, encodedPassword, name, surname, role, null);
    }

    private User createUserIfNotExists(String email, String encodedPassword, String name, String surname, UserRole role, User supervisor) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .email(email)
                    .password(encodedPassword)
                    .name(name)
                    .surname(surname)
                    .userRole(role)
                    .userStatus(UserStatus.ACTIVE)
                    .supervisor(supervisor)
                    .build();

            User savedUser = userRepository.save(user);
            log.info("Created user: {} with role: {}", email, role);
            return savedUser;
        });
    }
}