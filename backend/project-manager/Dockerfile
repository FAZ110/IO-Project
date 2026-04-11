FROM gradle:9.4.1-jdk25 AS builder
WORKDIR /app
COPY . .
RUN ./gradlew build -x test

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=builder /app/build/libs/project-manager-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
