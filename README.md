# Fair Benefits Web Application

Welcome to the Fair Benefits web application, hosted at [fairbenefits.org](https://fairbenefits.org). This application helps users discover their eligibility for state and federal benefits through a series of quizzes. Admins can manage the questions, benefits, and quizzes through an admin interface.

## Table of Contents

- Overview
- Frontend
- Backend
- [AWS Integration](#aws-integration)
- [User Flow](#user-flow)
- [Admin Flow](#admin-flow)
- [Getting Started](#getting-started)
- Contributing
- License

## Overview

The Fair Benefits web application is a full-stack application designed to help users determine their eligibility for various benefits. The application consists of a frontend built with React.js, a backend built with Java Spring Boot, and is integrated with various AWS services for hosting and scalability.

## Frontend

The frontend of the Fair Benefits web application is built using React.js. It provides a user-friendly interface for users to create accounts, log in, and take quizzes to determine their benefit eligibility. The frontend is hosted on AWS S3 and served through AWS CloudFront for optimal performance and scalability.

### Key Features

- **User Authentication**: Users can create accounts and log in to access personalized quizzes.
- **Quizzes**: Users can take quizzes to determine their eligibility for various benefits.
- **Responsive Design**: The application is designed to be responsive and works seamlessly on both desktop and mobile devices.

## Backend

The backend of the Fair Benefits web application is built using Java Spring Boot. It handles user authentication, quiz management, and benefit eligibility calculations. The backend is hosted on an AWS EC2 instance and uses AWS RDS for database management.

### Key Features

- **User Management**: Handles user registration, login, and authentication.
- **Quiz Management**: Manages quizzes, questions, and benefit eligibility calculations.
- **Admin Interface**: Provides an interface for admins to manage questions, benefits, and quizzes.

## AWS Integration

The Fair Benefits web application leverages various AWS services to ensure scalability, security, and high availability.

### AWS Services Used

- **EC2**: Hosts the backend application.
- **S3**: Hosts the frontend application.
- **ALB (Application Load Balancer)**: Distributes incoming traffic to the backend instances.
- **ACM (AWS Certificate Manager)**: Manages SSL/TLS certificates for secure communication.
- **CloudFront**: Distributes content globally with low latency.
- **IAM (Identity and Access Management)**: Manages access control for AWS resources.
- **VPC (Virtual Private Cloud)**: Provides a secure network environment.
- **Security Groups**: Controls inbound and outbound traffic to the backend instances.
- **RDS (Relational Database Service)**: Manages the SQL database for the application.
- **Route 53**: Manages DNS routing for the application.

## User Flow

1. **Account Creation**: Users can create an account by providing their email and password.
2. **Login**: Users can log in to their account to access personalized quizzes.
3. **Take Quizzes**: Users can take quizzes to determine their eligibility for various state and federal benefits.
4. **View Results**: Users can view their eligibility results and get information about the benefits they qualify for.

## Admin Flow

1. **Admin Login**: Admins can log in from [fairbenefits.org/admin-login](https://fairbenefits.org/admin-login) using the username: `admin` and password: `1234`.
                (We ask that you refrain from editing any of the existing questions, benefits, or quizzes as the admin login is provided to be informative.)
2. **Manage Questions**: Admins can add, edit, and delete questions used in the quizzes.
3. **Manage Benefits**: Admins can add, edit, and delete benefits, along with their respective requirements and conditions.
4. **Manage Quizzes**: Admins can create and manage quizzes, including assigning questions and benefits to each quiz.

## Getting Started

### Prerequisites

- Node.js and npm installed
- Java Development Kit (JDK) installed
- Docker installed
- AWS CLI configured

### Frontend Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/ImNotJ/benefitaid.git
   cd benefits-app
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Build the application**:
   ```sh
   npm run build
   ```

4. **Deploy to S3**:
   ```sh
   aws s3 sync build/ s3://benefits-frontend --delete
   ```

### Backend Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/ImNotJ/benefitaid.git
   cd benefits-backend
   ```

2. **Build the Docker image**:
   ```sh
   docker build -t imnotj/benefits-backend:latest .
   ```

3. **Push the Docker image to Docker Hub**:
   ```sh
   docker push imnotj/benefits-backend:latest
   ```

4. **Deploy to EC2**:
   ```sh
   ssh -i "~/aws-keys/benefits-backend.pem" ec2-user@ec2-52-71-148-64.compute-1.amazonaws.com
   docker pull imnotj/benefits-backend:latest
   docker run -d --name benefits-backend -p 8080:8080 imnotj/benefits-backend:latest
   ```

## Contributing

We welcome contributions to the Fair Benefits web application. Please fork the repository and submit pull requests for any enhancements or bug fixes.

---

Thank you for using the Fair Benefits web application. If you have any questions or need further assistance, please contact us at [saravanan.jai@gmail.com](mailto:saravanan.jai@gmail.com).