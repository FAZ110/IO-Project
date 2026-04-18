FROM gradle:9.4.1-jdk25 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle gradle
COPY gradlew .
RUN ./gradlew dependencies --no-daemon
copy config config
COPY src src
RUN ./gradlew build -x test --no-daemon

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=builder /app/build/libs/project-manager-*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
