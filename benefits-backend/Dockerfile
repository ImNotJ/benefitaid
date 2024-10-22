# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Set environment variables
ENV ROOT_ADMIN_USERNAME=admin
ENV ROOT_ADMIN_PASSWORD=1234
ENV JWT_SECRET_KEY=0e06a772b0f7eeaff45d08829b2faafe1ac96b13a42a6272a3377ca5291f1a11
ENV DB_USERNAME=admin
ENV DB_PASSWORD=5247510625,Admin

# Copy the JAR file from the host to the container
COPY target/benefits-backend-0.0.1-SNAPSHOT.jar /app/benefits-backend.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "benefits-backend.jar"]