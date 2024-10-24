# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Accept build arguments and set environment variables
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

# Copy the JAR file from the host to the container
COPY target/benefits-backend-0.0.1-SNAPSHOT.jar /app/benefits-backend.jar

# Expose the port the application runs on
EXPOSE 8080
