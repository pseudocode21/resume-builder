# Stage 1: Build Spring Boot application (Maven + Java 21 pre-installed)
FROM maven:3-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests -B

# Stage 2: Run Spring Boot JAR (Java 21 - Debian with full SSL/TLS support)
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
