# First stage: Build the application with Maven
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory inside the container for the build process
WORKDIR /app

# Copy the project files into the container
COPY . .

# Build the project using Maven and package it as a JAR file
RUN mvn clean package -DskipTests

# Second stage: Use the OpenJDK runtime for the application
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Accept build arguments and set them as environment variables
ARG ROOT_ADMIN_USERNAME
ARG ROOT_ADMIN_PASSWORD
ARG JWT_SECRET_KEY
ARG DB_USERNAME
ARG DB_PASSWORD

ENV ROOT_ADMIN_USERNAME=${ROOT_ADMIN_USERNAME}
ENV ROOT_ADMIN_PASSWORD=${ROOT_ADMIN_PASSWORD}
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}

# Copy the JAR file from the first stage (build stage) into the container
COPY --from=build /app/target/benefits-backend-0.0.1-SNAPSHOT.jar /app/benefits-backend.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/benefits-backend.jar"]
