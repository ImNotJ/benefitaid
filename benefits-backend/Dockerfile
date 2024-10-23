# Build stage
FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/benefits-backend-0.0.1-SNAPSHOT.jar benefits-backend.jar

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

# Add MySQL driver to classpath explicitly
RUN mkdir -p /app/lib
COPY --from=builder /root/.m2/repository/mysql/mysql-connector-java/8.0.30/mysql-connector-java-8.0.30.jar /app/lib/

ENV CLASSPATH=/app/lib/*:$CLASSPATH

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "benefits-backend.jar"]