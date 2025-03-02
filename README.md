### Loan Tracker Service: System Architecture

This document outlines the system architecture for the **Loan Tracker Service**, a backend service built using **Node.js/NestJS**, **Prisma ORM**, and **PostgreSQL**. The service is designed to manage loans, payments, user profiles, notifications, and audit logs. It incorporates best practices such as **API rate limiting**, **cron jobs for email reminders**, **JWT-based authentication**, **role-based access control (RBAC)**, and more.

---

## **1. High-Level Architecture Overview**

The system is divided into several layers and components, each responsible for specific functionality:

1. **API Layer**: Handles incoming HTTP requests and routes them to the appropriate service.
2. **Service Layer**: Contains business logic and interacts with the database via Prisma ORM.
3. **Data Access Layer**: Manages database operations using Prisma.
4. **Authentication & Authorization Layer**: Handles JWT-based authentication and role-based access control.
5. **Background Jobs Layer**: Manages cron jobs for sending email reminders and handling overdue payments.
6. **Logging & Monitoring Layer**: Tracks system activity and errors for debugging and auditing.

---

## **2. Detailed Architecture**

### **2.1 API Layer**

- **Framework**: NestJS
- **Responsibilities**:
  - Expose RESTful APIs for client applications.
  - Validate incoming requests using **class-validator** and **class-transformer**.
  - Apply **rate limiting** to prevent abuse (e.g., using `@nestjs/throttler`).
  - Handle errors and return standardized responses.

#### Key Endpoints:

- **Auth**: `/auth/login`, `/auth/register`, `/auth/refresh-token`
- **Users**: `/users`, `/users/:id`, `/users/:id/loans`
- **Loans**: `/loans`, `/loans/:id`, `/loans/:id/payments`
- **Payments**: `/payments`, `/payments/:id`
- **Notifications**: `/notifications`, `/notifications/:id`
- **Profile**: `/profile`, `/profile/:id`
- **Audit Logs**: `/audit-logs`

---

### **2.2 Service Layer**

- **Responsibilities**:
  - Implement business logic (e.g., loan approval, payment processing).
  - Interact with the **Data Access Layer** (Prisma) to perform CRUD operations.
  - Trigger background jobs (e.g., email reminders for overdue payments).

#### Key Services:

- **AuthService**: Handles user authentication and JWT token generation.
- **UserService**: Manages user-related operations (e.g., CRUD, role assignment).
- **LoanService**: Manages loan creation, approval, and status updates.
- **PaymentService**: Handles payment processing and overdue penalty calculations.
- **NotificationService**: Sends notifications to users (e.g., payment reminders).
- **ProfileService**: Manages user profile information.
- **AuditLogService**: Logs user actions for auditing purposes.

---

### **2.3 Data Access Layer**

- **ORM**: Prisma
- **Database**: PostgreSQL
- **Responsibilities**:
  - Define database models and relationships (as shown in your Prisma schema).
  - Perform CRUD operations using Prisma Client.
  - Handle database migrations.

#### Key Models:

- **User**: Stores user information and roles.
- **Loan**: Tracks loan details, status, and associated payments.
- **Payment**: Records payments made against loans.
- **Notification**: Stores notifications for users.
- **Profile**: Stores user profile details.
- **AuditLog**: Logs user actions for auditing.

---

### **2.4 Authentication & Authorization Layer**

- **Authentication**: JWT (JSON Web Tokens)
  - Users log in with their credentials and receive a JWT.
  - The JWT contains the user's ID, role, and expiration time.
  - JWTs are validated on each request to ensure the user is authenticated.
- **Authorization**: Role-Based Access Control (RBAC)
  - Users are assigned roles (`ADMIN`, `USER`, `MANAGER`).
  - Guards are used to restrict access to endpoints based on roles (e.g., only `ADMIN` can approve loans).

#### Key Components:

- **AuthGuard**: Ensures the user is authenticated.
- **RolesGuard**: Restricts access based on user roles.

---

### **2.5 Background Jobs Layer**

- **Library**: `@nestjs/schedule` for cron jobs.
- **Responsibilities**:
  - Send email reminders for upcoming payments.
  - Check for overdue payments and apply penalties.
  - Send notifications to users for important events (e.g., loan approval).

#### Key Jobs:

- **Payment Reminder Job**:
  - Runs daily to check for payments due in the next 3 days.
  - Sends email reminders to users.
- **Overdue Payment Job**:
  - Runs daily to check for overdue payments.
  - Applies penalty fees and updates loan status to `OVERDUE`.
  - Sends notifications to users.

---

### **2.6 Logging & Monitoring Layer**

- **Library**: `nestjs-pino` or `winston` for logging.
- **Responsibilities**:
  - Log all incoming requests and responses.
  - Log errors and exceptions for debugging.
  - Track user actions for auditing (stored in the `AuditLog` table).

#### Key Features:

- **Request Logging**: Logs method, URL, status code, and response time.
- **Error Logging**: Logs stack traces and error details.
- **Audit Logging**: Logs user actions (e.g., loan approval, payment processing).

---

## **3. Best Practices**

### **3.1 Security**

- Use **HTTPS** to encrypt data in transit.
- Hash passwords using **bcrypt** or **argon2**.
- Validate and sanitize all user inputs to prevent SQL injection and XSS attacks.
- Use **CSRF tokens** for sensitive operations.

### **3.2 Rate Limiting**

- Apply rate limiting to prevent abuse (e.g., 100 requests per minute per user).
- Use `@nestjs/throttler` to implement rate limiting.

### **3.3 Error Handling**

- Use NestJS's built-in exception filters to handle errors.
- Return standardized error responses (e.g., `{ statusCode: 400, message: "Bad Request" }`).

### **3.4 Testing**

- Write unit tests for services and controllers using **Jest**.
- Write integration tests to test API endpoints.
- Use mocking to isolate dependencies (e.g., mock Prisma Client).

### **3.5 Documentation**

- Use **Swagger** to document APIs.
- Provide clear documentation for each endpoint, including request/response examples.

---

## **4. Deployment**

### **4.1 Environment Variables**

- Store sensitive information (e.g., database URL, JWT secret) in environment variables.
- Use `.env` files for local development.

### **4.2 Database**

- Use **PostgreSQL** as the primary database.
- Set up automated backups and monitoring.

### **4.3 Hosting**

- Deploy the application on a cloud platform (e.g., AWS, Heroku, DigitalOcean).
- Use **Docker** for containerization.

### **4.4 CI/CD**

- Set up a CI/CD pipeline (e.g., GitHub Actions, CircleCI) for automated testing and deployment.

---

## **5. Example Workflow**

1. **User Registration**:

   - A user registers via `/auth/register`.
   - Their password is hashed and stored in the database.
   - A JWT is generated and returned to the client.

2. **Loan Application**:

   - A user applies for a loan via `/loans`.
   - The loan is created with a `PENDING` status.
   - An `ADMIN` or `MANAGER` approves the loan, updating its status to `APPROVED`.

3. **Payment Processing**:

   - A user makes a payment via `/payments`.
   - The payment is recorded, and the loan's `totalPaid` is updated.
   - If the payment is overdue, a penalty is applied.

4. **Email Reminders**:

   - A cron job checks for upcoming payments and sends email reminders.

5. **Audit Logging**:
   - All user actions (e.g., loan approval, payment processing) are logged in the `AuditLog` table.

---

## **6. Tools & Libraries**

- **NestJS**: Framework for building scalable server-side applications.
- **Prisma**: ORM for database access.
- **PostgreSQL**: Relational database.
- **JWT**: For authentication.
- **@nestjs/throttler**: For rate limiting.
- **@nestjs/schedule**: For cron jobs.
- **Nodemailer**: For sending emails.
- **Jest**: For testing.
- **Swagger**: For API documentation.

---

This architecture ensures security, scalability, and maintainability while following best practices of build backend service and handling complex business logic.
