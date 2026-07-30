# Stage 1: Build Spring Boot application with Maven (Java 21)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Stage 2: Run Spring Boot JAR (Java 21)
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
