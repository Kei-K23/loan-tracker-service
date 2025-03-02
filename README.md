# Loan Tracker Service - System Architecture

## 1. Overview

The **Loan Tracker Service** is a backend system that allows users to apply for loans, track their payments, receive notifications, and manage their accounts. The system is built using **Node.js/NestJS**, **Prisma ORM**, and **PostgreSQL**, with a focus on security, scalability, and maintainability.

## 2. Tech Stack

- **Backend Framework**: NestJS (TypeScript-based)
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Authentication**: JWT-based authentication
- **Authorization**: Role-Based Access Control (RBAC)
- **Caching**: Redis
- **Queue Management**: BullMQ (Redis-based)
- **Background Jobs**: Cron jobs for scheduled notifications
- **Logging & Monitoring**: Winston + Prometheus/Grafana
- **Security**: API rate limiting, input validation, secure headers

## 3. System Architecture

### 3.1 Module Structure (NestJS)

The system is designed in a **modular structure** to ensure scalability and maintainability:

- **Auth Module**: Handles authentication, JWT, and user sessions.
- **User Module**: Manages user registration, roles, profiles.
- **Loan Module**: Manages loan applications, status updates.
- **Payment Module**: Handles loan repayments and overdue tracking.
- **Notification Module**: Sends reminders for due and overdue payments.
- **AuditLog Module**: Tracks user actions for accountability.

### 3.2 Database Schema (Prisma)

The schema follows best practices:

- **Entities**: Users, Loans, Payments, Notifications, Profiles, Audit Logs.
- **Relations**:
  - One-to-many between **User and Loan**.
  - One-to-many between **Loan and Payments**.
  - One-to-one between **User and Profile**.
  - One-to-many between **User and Notifications**.
- **Indexes**: Unique constraints on `email`, `username`, `userId`.
- **Default Values**: UUID for primary keys, `now()` for timestamps.

## 4. Security Best Practices

- **JWT Authentication**: Access tokens with expiration, refresh tokens for long-term sessions.
- **Role-Based Access Control (RBAC)**: Enforce `ADMIN`, `MANAGER`, `USER` permissions using NestJS Guards.
- **API Rate Limiting**: Implement `nestjs/throttler` to prevent abuse.
- **Input Validation**: Use `class-validator` and `class-transformer` to validate incoming data.
- **Database Security**: Store passwords with bcrypt hashing and implement environment-based DB credentials.

## 5. Payment Reminders & Notifications

- **Scheduled Cron Jobs**:
  - **Daily reminder**: Notify users of upcoming payments.
  - **Overdue alert**: Alert users of overdue payments and penalties.
  - **Audit Log Cleanup**: Periodically archive old logs.
- **Implementation**:
  - Use `nestjs/schedule` for cron jobs.
  - Store messages in the Notification table.

## 7. API Endpoints (RESTful Design)

### Authentication

- `POST /auth/register` – Register new users.
- `POST /auth/login` – Authenticate users and return JWT.

### Loan Management

- `POST /loans/apply` – Apply for a loan.
- `GET /loans/:id` – Get loan details.
- `PATCH /loans/:id/approve` – Approve a loan (Admin only).
- `GET /loans/user/:userId` – Get loans for a specific user.

### Payment Processing

- `POST /payments/:loanId` – Make a payment for a loan.
- `GET /payments/user/:userId` – Get payment history for a user.
- `GET /payments/overdue` – Get overdue payments.

### Notifications

- `GET /notifications/user/:userId` – Fetch user notifications.
- `PATCH /notifications/:id/read` – Mark notification as read.

## 8. Deployment & Scalability

- **Docker**: Containerized deployment.
- **CI/CD**: GitHub Actions for automated tests & deployments.
- **Load Balancing**: Use **NGINX** with multiple instances.
- **Database Scaling**: Read replicas for PostgreSQL, optimize indexes.
- **Microservices (Future Scope)**: Extract Payments & Notifications into microservices for scalability.

## 9. Conclusion

This architecture ensures **security, scalability, and maintainability** while following best practices of build backend service and handling complex business logic.
