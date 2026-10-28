# --- Stage 1: Build the Application with Maven ---
FROM eclipse-temurin:25-jdk AS builder
WORKDIR /build

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw package -DskipTests

# --- Stage 2: Runtime Image ---
FROM eclipse-temurin:25-jre
WORKDIR /app

# Create user safely without forcing conflicting group IDs
RUN useradd -r -u 1000 -s /bin/sh spring || true
USER 1000:1000

# Copy the built jar from the builder stage
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
