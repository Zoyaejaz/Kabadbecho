# Use a Docker image with Gradle and Java 22 to build the project
FROM gradle:8.8-jdk22 AS build
WORKDIR /app
COPY . .
# Build the application, skipping tests to speed up the build on Render
RUN gradle build -x test --no-daemon

# Use a lightweight Java 22 JDK image to run the application
FROM openjdk:22-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
