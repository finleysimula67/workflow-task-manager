# ============================================
# MULTI-STAGE BUILD FOR SPRING BOOT APP
# ============================================

# Stage 1: Build (uses Maven directly - no mvnw needed)
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/workflow-0.0.1-SNAPSHOT.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads && \
    addgroup -S spring && \
    adduser -S spring -G spring && \
    chown -R spring:spring /app

# Switch to non-root user
USER spring:spring

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run with production profile
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
