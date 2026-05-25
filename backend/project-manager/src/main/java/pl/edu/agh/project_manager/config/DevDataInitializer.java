package pl.edu.agh.project_manager.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.edu.agh.project_manager.domain.entity.project.Project;
import pl.edu.agh.project_manager.domain.entity.project.ProjectAssignment;
import pl.edu.agh.project_manager.domain.entity.projectgroup.ProjectGroup;
import pl.edu.agh.project_manager.domain.entity.user.Qualification;
import pl.edu.agh.project_manager.domain.entity.user.Skill;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.AssignmentStatus;
import pl.edu.agh.project_manager.domain.enums.GroupType;
import pl.edu.agh.project_manager.domain.enums.QualificationStatus;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.repository.project.ProjectAssignmentRepository;
import pl.edu.agh.project_manager.repository.project.ProjectRepository;
import pl.edu.agh.project_manager.repository.projectgroup.ProjectGroupRepository;
import pl.edu.agh.project_manager.repository.user.QualificationRepository;
import pl.edu.agh.project_manager.repository.user.SkillRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;

import java.time.LocalDate;
import java.util.List;

@Configuration
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DevDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final QualificationRepository qualificationRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository assignmentRepository;
    private final ProjectGroupRepository projectGroupRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.admin.username}")
    private String adminUsername;
    @Value("${application.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        log.info("DEV data seeding started");

        BaseUsers base = seedBaseUsers();
        ExtendedUsers extended = seedExtendedUsers(base);
        seedQualifications(base, extended);
        Groups groups = seedProjectGroups(base);
        Projects projects = seedProjects(base, extended, groups);
        seedAssignments(base, extended, projects);

        log.info("DEV data seeding finished");
    }

    private record BaseUsers(User admin, User authority, User linearManager, User projectManager, User common) {}

    private BaseUsers seedBaseUsers() {
        String defaultPassword = passwordEncoder.encode("password123");

        User admin = createUserIfNotExists(
                adminUsername, passwordEncoder.encode(adminPassword),
                "Super", "Admin", UserRole.ADMINISTRATOR, null
        );
        User authority = createUserIfNotExists(
                "authority@dev.com", defaultPassword,
                "Jan", "Władza", UserRole.AUTHORITY, null
        );
        User linearManager = createUserIfNotExists(
                "linear@dev.com", defaultPassword,
                "Piotr", "Liniowy", UserRole.LINEAR_MANAGER, null
        );
        User projectManager = createUserIfNotExists(
                "pm@dev.com", defaultPassword,
                "Anna", "Manager", UserRole.PROJECT_MANAGER, null
        );
        User common = createUserIfNotExists(
                "common@dev.com", defaultPassword,
                "Maciej", "Pracownik", UserRole.COMMON, linearManager
        );

        return new BaseUsers(admin, authority, linearManager, projectManager, common);
    }

    private record ExtendedUsers(
            User linearManagerTwo,
            User projectManagerTwo,
            User projectManagerThree,
            User commonTwo, User commonThree, User commonFour,
            User commonFive, User commonSix, User commonSeven
    ) {}

    private ExtendedUsers seedExtendedUsers(BaseUsers base) {
        String defaultPassword = passwordEncoder.encode("password123");

        ensureSupervisor(base.linearManager(), base.authority());
        ensureSupervisor(base.projectManager(), base.linearManager());

        User linearManagerTwo = createUserIfNotExists(
                "lm2@dev.com", defaultPassword,
                "Ewa", "Wiśniewska", UserRole.LINEAR_MANAGER, base.authority()
        );

        User projectManagerTwo = createUserIfNotExists(
                "pm2@dev.com", defaultPassword,
                "Krzysztof", "Zieliński", UserRole.PROJECT_MANAGER, linearManagerTwo
        );
        User projectManagerThree = createUserIfNotExists(
                "pm3@dev.com", defaultPassword,
                "Magdalena", "Wójcik", UserRole.PROJECT_MANAGER, base.linearManager()
        );

        User commonTwo = createUserIfNotExists(
                "common2@dev.com", defaultPassword,
                "Katarzyna", "Nowak", UserRole.COMMON, base.linearManager()
        );
        User commonThree = createUserIfNotExists(
                "common3@dev.com", defaultPassword,
                "Tomasz", "Kowalski", UserRole.COMMON, base.linearManager()
        );
        User commonFour = createUserIfNotExists(
                "common4@dev.com", defaultPassword,
                "Aleksandra", "Lewandowska", UserRole.COMMON, base.linearManager()
        );

        User commonFive = createUserIfNotExists(
                "common5@dev.com", defaultPassword,
                "Bartosz", "Kamiński", UserRole.COMMON, linearManagerTwo
        );
        User commonSix = createUserIfNotExists(
                "common6@dev.com", defaultPassword,
                "Natalia", "Szymańska", UserRole.COMMON, linearManagerTwo
        );
        User commonSeven = createUserIfNotExists(
                "common7@dev.com", defaultPassword,
                "Paweł", "Dąbrowski", UserRole.COMMON, linearManagerTwo
        );

        return new ExtendedUsers(
                linearManagerTwo, projectManagerTwo, projectManagerThree,
                commonTwo, commonThree, commonFour,
                commonFive, commonSix, commonSeven
        );
    }

    private void seedQualifications(BaseUsers base, ExtendedUsers ext) {
        addAcceptedQualifications(base.common(), List.of("Java", "Spring Boot", "PostgreSQL", "Docker"));
        addWaitingQualifications(base.common(), List.of("Kubernetes", "AWS"));
        addRejectedQualifications(base.common(), List.of("COBOL"));

        addAcceptedQualifications(ext.commonTwo(), List.of("React", "TypeScript", "TailwindCSS"));
        addWaitingQualifications(ext.commonTwo(), List.of("Next.js"));

        addAcceptedQualifications(ext.commonThree(), List.of("Python", "Machine Learning", "TensorFlow"));
        addWaitingQualifications(ext.commonThree(), List.of("PyTorch"));

        addAcceptedQualifications(ext.commonFour(), List.of("UX Design", "Figma", "Design Systems"));

        addAcceptedQualifications(ext.commonFive(), List.of("DevOps", "Linux", "Bash"));
        addWaitingQualifications(ext.commonFive(), List.of("Terraform"));

        addAcceptedQualifications(ext.commonSix(), List.of("QA Manual", "QA Automation", "Cypress"));

        addAcceptedQualifications(ext.commonSeven(), List.of("Java", "Spring Boot"));
        addWaitingQualifications(ext.commonSeven(), List.of("Kafka"));
    }

    private record Groups(ProjectGroup digitalization, ProjectGroup research) {}

    private Groups seedProjectGroups(BaseUsers base) {
        ProjectGroup digitalization = createProjectGroupIfNotExists(
                "Cyfryzacja Wydziału",
                "Portfel projektów modernizujących infrastrukturę cyfrową wydziału.",
                base.authority(), GroupType.WALLET
        );
        ProjectGroup research = createProjectGroupIfNotExists(
                "Program Badawczy 2026",
                "Program wspierający projekty badawcze realizowane w 2026 roku.",
                base.authority(), GroupType.PROGRAM
        );
        return new Groups(digitalization, research);
    }

    private record Projects(
            Project recruitment, Project alumni, Project mobileApp,
            Project elearning, Project libraryMigration,
            Project aiResearch, Project graphResearch,
            Project lan, Project securityAudit
    ) {}

    private Projects seedProjects(BaseUsers base, ExtendedUsers ext, Groups groups) {
        Project recruitment = createProjectIfNotExists(
                "System rekrutacyjny",
                "Nowa platforma do obsługi procesu rekrutacji studentów.",
                base.projectManager(),
                LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(4),
                true, groups.digitalization()
        );
        Project alumni = createProjectIfNotExists(
                "Portal absolwenta",
                "Portal społeczności absolwentów wydziału z bazą ofert pracy.",
                base.projectManager(),
                LocalDate.now().minusMonths(6), LocalDate.now().minusMonths(1),
                false, groups.digitalization()
        );
        Project mobileApp = createProjectIfNotExists(
                "Aplikacja mobilna studenta",
                "Mobilna aplikacja iOS/Android z planem zajęć i ocenami.",
                base.projectManager(),
                LocalDate.now().minusWeeks(3), LocalDate.now().plusMonths(7),
                true, groups.digitalization()
        );

        Project elearning = createProjectIfNotExists(
                "Platforma e-learningowa",
                "Wewnętrzna platforma e-learningowa dla pracowników wydziału.",
                ext.projectManagerTwo(),
                LocalDate.now().minusMonths(4), LocalDate.now().plusMonths(2),
                true, groups.digitalization()
        );
        Project libraryMigration = createProjectIfNotExists(
                "Migracja biblioteki",
                "Migracja systemu bibliotecznego do nowej infrastruktury chmurowej.",
                ext.projectManagerTwo(),
                LocalDate.now().minusMonths(8), LocalDate.now().minusMonths(2),
                false, null
        );

        Project aiResearch = createProjectIfNotExists(
                "Badania nad AI",
                "Projekt badawczy dotyczący zastosowań AI w analizie obrazów medycznych.",
                ext.projectManagerThree(),
                LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(11),
                true, groups.research()
        );
        Project graphResearch = createProjectIfNotExists(
                "Analiza grafów społecznych",
                "Badania nad strukturami społeczności w sieciach naukowych.",
                ext.projectManagerThree(),
                LocalDate.now().plusWeeks(2), LocalDate.now().plusMonths(9),
                true, groups.research()
        );

        Project lan = createProjectIfNotExists(
                "Modernizacja sieci LAN",
                "Wymiana infrastruktury sieciowej w budynku D17.",
                base.authority(),
                LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(8),
                true, groups.digitalization()
        );
        Project securityAudit = createProjectIfNotExists(
                "Audyt bezpieczeństwa IT",
                "Kompleksowy audyt bezpieczeństwa systemów wydziałowych.",
                base.authority(),
                LocalDate.now().minusMonths(5), LocalDate.now().minusWeeks(2),
                false, null
        );

        return new Projects(recruitment, alumni, mobileApp, elearning, libraryMigration,
                aiResearch, graphResearch, lan, securityAudit);
    }

    private void seedAssignments(BaseUsers base, ExtendedUsers ext, Projects p) {
        createAssignmentIfNotExists(base.common(), p.recruitment(), "Backend Developer",
                LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(3), 60);
        createAssignmentIfNotExists(base.common(), p.lan(), "Konsultant techniczny",
                LocalDate.now().plusWeeks(2), LocalDate.now().plusMonths(2), 50);

        createAssignmentIfNotExists(ext.commonTwo(), p.mobileApp(), "Frontend Developer",
                LocalDate.now().minusWeeks(2), LocalDate.now().plusMonths(5), 80);

        createAssignmentIfNotExists(ext.commonThree(), p.aiResearch(), "ML Engineer",
                LocalDate.now().minusWeeks(3), LocalDate.now().plusMonths(8), 100);

        createAssignmentIfNotExists(ext.commonFour(), p.recruitment(), "UX Designer",
                LocalDate.now().minusMonths(1), LocalDate.now().plusWeeks(6), 30);
        createAssignmentIfNotExists(ext.commonFour(), p.mobileApp(), "UX Designer",
                LocalDate.now().minusWeeks(1), LocalDate.now().plusMonths(4), 40);

        createAssignmentIfNotExists(ext.commonFive(), p.libraryMigration(), "DevOps Engineer",
                LocalDate.now().minusMonths(3), LocalDate.now().minusWeeks(4), 70);
        createAssignmentIfNotExists(ext.commonFive(), p.elearning(), "DevOps Engineer",
                LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(2), 50);

        createAssignmentIfNotExists(ext.commonSix(), p.elearning(), "QA Engineer",
                LocalDate.now().minusWeeks(2), LocalDate.now().plusMonths(2), 60);
        createAssignmentIfNotExists(ext.commonSix(), p.recruitment(), "QA Engineer",
                LocalDate.now().plusWeeks(1), LocalDate.now().plusMonths(3), 40);

        createAssignmentIfNotExists(ext.commonSeven(), p.alumni(), "Backend Developer",
                LocalDate.now().minusMonths(4), LocalDate.now().minusMonths(1), 100);
    }

    private User createUserIfNotExists(String email, String encodedPassword, String name, String surname, UserRole role, User supervisor) {
        return userRepository.findByEmail(email)
                .map(existing -> {
                    if (supervisor != null && existing.getSupervisor() == null) {
                        existing.setSupervisor(supervisor);
                        User updated = userRepository.save(existing);
                        log.info("Backfilled supervisor for {}: → {}", email, supervisor.getEmail());
                        return updated;
                    }
                    return existing;
                })
                .orElseGet(() -> {
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

    private void ensureSupervisor(User user, User supervisor) {
        if (supervisor == null || user.getSupervisor() != null) return;
        user.setSupervisor(supervisor);
        userRepository.save(user);
        log.info("Backfilled supervisor for {}: → {}", user.getEmail(), supervisor.getEmail());
    }

    private Skill getOrCreateSkill(String name, boolean valid) {
        return skillRepository.findByNameIgnoreCase(name).orElseGet(() -> {
            Skill skill = Skill.builder().name(name).valid(valid).build();
            return skillRepository.save(skill);
        });
    }

    private void addAcceptedQualifications(User user, List<String> skillNames) {
        addQualifications(user, skillNames, QualificationStatus.ACCEPTED);
    }

    private void addWaitingQualifications(User user, List<String> skillNames) {
        addQualifications(user, skillNames, QualificationStatus.WAITING);
    }

    private void addRejectedQualifications(User user, List<String> skillNames) {
        addQualifications(user, skillNames, QualificationStatus.REJECTED);
    }

    private void addQualifications(User user, List<String> skillNames, QualificationStatus status) {
        boolean valid = status == QualificationStatus.ACCEPTED;
        for (String skillName : skillNames) {
            Skill skill = getOrCreateSkill(skillName, valid);
            boolean exists = qualificationRepository.findAllByUser_Id(user.getId()).stream()
                    .anyMatch(q -> q.getSkill().getId().equals(skill.getId()));
            if (exists) continue;

            Qualification q = Qualification.builder()
                    .user(user)
                    .skill(skill)
                    .status(status)
                    .build();
            qualificationRepository.save(q);
        }
    }

    private ProjectGroup createProjectGroupIfNotExists(String name, String description, User owner, GroupType type) {
        return projectGroupRepository.findAll().stream()
                .filter(g -> g.getName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    ProjectGroup group = ProjectGroup.builder()
                            .name(name)
                            .description(description)
                            .owner(owner)
                            .groupType(type)
                            .build();
                    ProjectGroup saved = projectGroupRepository.save(group);
                    log.info("Created project group: {} ({})", name, type);
                    return saved;
                });
    }

    private Project createProjectIfNotExists(String title, String description, User manager,
                                             LocalDate start, LocalDate end, boolean isActive,
                                             ProjectGroup group) {
        return projectRepository.findAllByProjectManagerId(manager.getId()).stream()
                .filter(p -> p.getTitle().equals(title))
                .findFirst()
                .orElseGet(() -> {
                    Project project = Project.builder()
                            .title(title)
                            .description(description)
                            .projectManager(manager)
                            .projectGroup(group)
                            .startDate(start)
                            .endDate(end)
                            .isActive(isActive)
                            .build();
                    Project saved = projectRepository.save(project);
                    log.info("Created project: {} (manager: {})", title, manager.getEmail());
                    return saved;
                });
    }

    private void createAssignmentIfNotExists(User user, Project project, String roleName,
                                             LocalDate start, LocalDate end, int utilization) {
        boolean exists = assignmentRepository.findAllByUserIdAndStatus(user.getId(), AssignmentStatus.ACCEPTED).stream()
                .anyMatch(a -> a.getProject().getId().equals(project.getId()) && a.getRoleName().equals(roleName));
        if (exists) return;

        ProjectAssignment assignment = ProjectAssignment.builder()
                .user(user)
                .project(project)
                .roleName(roleName)
                .startDate(start)
                .endDate(end)
                .utilizationPercentage(utilization)
                .status(AssignmentStatus.ACCEPTED)
                .build();
        assignmentRepository.save(assignment);
        log.info("Created assignment: {} → {} ({}%)", user.getEmail(), project.getTitle(), utilization);
    }
}
