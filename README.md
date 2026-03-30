# IO-Project

This project is developed as part of the Software Engineering course. The application consists of a Java/Spring Boot backend and a React (TypeScript) frontend built with Vite.

## Team Members

- Jan Dyląg
- Szymon Barczyk
- Radosław Rogalski
- Paweł Sosnowski
- Patryk Blacha
- Maciej Trznadel

## Technologies

- **Backend:** Java 25, Spring Boot, Spring Web, Spring Data JPA, Lombok, Gradle
- **Database:** PostgreSQL
- **Frontend:** React, TypeScript, Vite

## Git & Jira Workflow (Smart Commits)

To keep our repository synchronized with Jira, please follow these naming conventions:

- **Branch names:** Include the Jira issue key (e.g., `feature/PROJ-123-add-login`)
- **Commit messages:** Always prefix the commit message with the Jira issue key (e.g., `PROJ-123: Add login component`)

## Initial Setup (Run Once)

### 1. Database Configuration

1. Create a local PostgreSQL database named `ioproject`.
2. Open `backend/src/main/resources/application.properties` and configure your credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/ioproject
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Install dependencies

```bash
cd frontend
npm install
```

4. Run backend

```bash
cd backend/project-manager
./gradlew bootRun
```

5. Run frontend

```bash
cd frontend
npm run dev
```
