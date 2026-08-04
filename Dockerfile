# Stage 1: Build Spring Boot application with Maven (Java 21)
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*
COPY . .
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Stage 2: Run Spring Boot JAR (Java 21 - Debian with full SSL/TLS support)
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
