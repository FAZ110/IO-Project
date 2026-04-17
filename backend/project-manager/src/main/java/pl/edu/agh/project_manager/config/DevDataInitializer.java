package pl.edu.agh.project_manager.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.repository.UserRepository;

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
        if (userRepository.findByEmail(adminUsername).isEmpty()) {
            log.info("Creating default admin account...");

            User admin = new User();
            admin.setEmail(adminUsername);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setName("Admin");
            admin.setSurname("Admin");
            admin.setUserRole(UserRole.ADMINISTRATOR);
            admin.setUserStatus(UserStatus.ACTIVE);

            userRepository.save(admin);
            log.info("Admin created with email: {} and password: {}", adminUsername, adminPassword);
        } else {
            log.info("Admin account already exists. Skipping initialization.");
        }
    }
}