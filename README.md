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
* **Backend:** Java 25, Spring Boot, Spring Web, Spring Data JPA, Lombok, Gradle
* **Database:** PostgreSQL
* **Frontend:** React, TypeScript, Vite


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
cd backend
./gradlew bootRun
```
5. Run frontend
```bash
cd frontend
npm run dev
```
