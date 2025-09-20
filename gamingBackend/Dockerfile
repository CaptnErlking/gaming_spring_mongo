# ---------- Build Stage ----------
# This stage builds both the frontend and backend into a single JAR file.
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the Maven project file first to leverage Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the backend and frontend source code
COPY src ./src
COPY frontend ./frontend

# Build the entire application (frontend and backend)
RUN mvn clean package -DskipTests

# ---------- Runtime Stage ----------
# This stage creates the final, lightweight image to run the application.
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy the final JAR from the build stage into the runtime image
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java","-jar","app.jar"]
