# WorkFlow - Full Stack Web Application

<div align="center">

![Java](https://img.shields.io/badge/Java-21+-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4x-brightgreen?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A modern, full-stack task management application built with Spring Boot and React, featuring JWT authentication, OAuth2 integration, and a clean, responsive UI.

[Live Demo](#) | [API Documentation](#) | [Report Bug](#) | [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About The Project

WorkFlow is a production-ready web application that allows users to manage their daily tasks efficiently. Built with modern technologies and industry best practices, this project demonstrates a complete full-stack development workflow from design to deployment.

### Why This Project?

- **Learn by Building**: Practical implementation of authentication, authorization, and CRUD operations
- **Industry Standards**: Follows RESTful API design, security best practices, and clean architecture
- **Portfolio Ready**: Fully deployed and documented for showcasing professional development skills
- **Real-World Features**: JWT authentication, OAuth2 integration, responsive design, and production deployment

<!---
### Screenshots

<div align="center">

| Login Page | Dashboard | Task Management |
|------------|-----------|-----------------|
<!----| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) | ![Tasks](screenshots/tasks.png) |----

</div>
--->
---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email validation
- Secure login with JWT (JSON Web Tokens)
- OAuth2 integration (Google Sign-In)
- Password encryption using BCrypt
- Token-based session management
- Protected routes and API endpoints

### 📝 Task Management
- Create, read, update, and delete tasks
- Task properties:
  - Title and description
  - Due date
  - Priority levels (Low, Medium, High)
  - Status tracking (To Do, In Progress, Done)
- User-specific task isolation (users can only see their own tasks)
- Real-time task filtering and search

### 🎨 User Interface
- Modern, responsive design (mobile-friendly)
- Clean and intuitive user experience
- Tailwind CSS styling
- Loading states and error handling
- Toast notifications for user feedback
- Dark mode support (optional)

### 🛡️ Security Features
- Password hashing with BCrypt
- JWT token authentication
- CORS configuration
- SQL injection prevention (JPA/Hibernate)
- XSS protection
- Environment-based configuration
- Secure HTTP headers

### 🚀 Additional Features
- API documentation with Swagger/OpenAPI
- Global exception handling
- Request validation
- Logging with SLF4J
- RESTful API design
- Pagination support (optional)

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Build Tool**: Maven
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security 6
- **Authentication**: JWT (jjwt library)
- **OAuth2**: Spring OAuth2 Client
- **Validation**: Bean Validation (Hibernate Validator)
- **Documentation**: SpringDoc OpenAPI (Swagger)
- **Testing**: JUnit 5, Mockito, Spring Boot Test

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **UI Components**: Lucide Icons (optional: Material-UI)
- **State Management**: React Context API

### DevOps & Deployment
- **Backend Hosting**: Railway / Render / AWS
- **Frontend Hosting**: Vercel / Netlify
- **Database Hosting**: Railway PostgreSQL / ElephantSQL
- **Version Control**: Git & GitHub
- **CI/CD**: GitHub Actions (optional)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Spring Boot    │◄───────►│   PostgreSQL    │
│   (Vite)        │  HTTP   │   Backend       │  JDBC   │    Database     │
│                 │  REST   │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Vercel/Netlify │         │ Railway/Render  │
│   (Hosting)     │         │   (Hosting)     │
└─────────────────┘         └─────────────────┘
```

### Backend Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Spring Boot Application            │
├──────────────────────────────────────────────────────┤
│  Controller Layer (REST API Endpoints)               │
│  ├── AuthController (/api/auth/*)                    │
│  └── TaskController (/api/tasks/*)                   │
├──────────────────────────────────────────────────────┤
│  Security Layer                                       │
│  ├── JwtAuthenticationFilter                         │
│  ├── JwtUtil                                          │
│  └── OAuth2LoginSuccessHandler                       │
├──────────────────────────────────────────────────────┤
│  Service Layer (Business Logic)                      │
│  ├── UserService                                      │
│  └── TaskService                                      │
├──────────────────────────────────────────────────────┤
│  Repository Layer (Data Access)                      │
│  ├── UserRepository                                   │
│  └── TaskRepository                                   │
├──────────────────────────────────────────────────────┤
│  Entity Layer (JPA Entities)                         │
│  ├── User                                             │
│  └── Task                                             │
└──────────────────────────────────────────────────────┘
```

### Database Schema

```sql
┌─────────────────────────┐         ┌─────────────────────────┐
│        users            │         │        tasks            │
├─────────────────────────┤         ├─────────────────────────┤
│ id (PK)                 │         │ id (PK)                 │
│ email (UNIQUE)          │         │ user_id (FK) ───────────┼──┐
│ password                │         │ title                   │  │
│ full_name               │         │ description             │  │
│ email_verified          │         │ due_date                │  │
│ created_at              │         │ priority                │  │
│ updated_at              │         │ status                  │  │
└─────────────────────────┘         │ created_at              │  │
         ▲                           │ updated_at              │  │
         │                           └─────────────────────────┘  │
         └──────────────────────────────────────────────────────┘
                        One-to-Many Relationship
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 17 or higher
  ```bash
  java -version
  ```

- **Maven**: Version 3.6+ (or use Maven wrapper included in project)
  ```bash
  mvn -version
  ```

- **Node.js & npm**: Version 16+ for frontend
  ```bash
  node -version
  npm -version
  ```

- **PostgreSQL**: Version 14+ (or use Docker)
  ```bash
  psql --version
  ```

- **Git**: For version control
  ```bash
  git --version
  ```

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
mvn clean install

# Or use Maven wrapper
./mvnw clean install
```

#### 3. Database Setup

**Option A: Local PostgreSQL**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskmanager;

# Create user (optional)
CREATE USER taskuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO taskuser;
```

**Option B: Docker**
```bash
docker run --name taskmanager-db \
  -e POSTGRES_DB=taskmanager \
  -e POSTGRES_USER=taskuser \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

#### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### Configuration

#### Backend Configuration

Create `application-dev.properties` in `src/main/resources/`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/taskmanager
spring.datasource.username=taskuser
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=your-256-bit-secret-key-replace-this-with-a-strong-random-string
jwt.expiration=86400000

# OAuth2 Configuration (Google)
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=profile,email
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/google

# CORS Configuration
cors.allowed.origins=http://localhost:5173

# Logging
logging.level.com.yourname.taskmanager=DEBUG
logging.level.org.springframework.security=DEBUG
```

**Important**: Never commit secrets to Git! Create a `.gitignore` entry:
```
application-dev.properties
application-prod.properties
.env
```

#### Frontend Configuration

Create `.env` file in frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:8080/login/oauth2/code/google`
5. Copy Client ID and Client Secret to configuration files

---

## 💻 Usage

### Running the Application Locally

#### Start Backend

```bash
# From backend directory
cd backend

# Run with Maven
mvn spring-boot:run

# Or use Maven wrapper
./mvnw spring-boot:run

# Backend will start at http://localhost:8080
```

#### Start Frontend

```bash
# From frontend directory (in a new terminal)
cd frontend

# Run development server
npm run dev

# Frontend will start at http://localhost:5173
```

### Using the Application

1. **Register a New Account**
   - Navigate to `http://localhost:5173`
   - Click "Sign Up"
   - Enter email, password, and full name
   - Submit registration

2. **Login**
   - Use registered credentials
   - Or click "Sign in with Google" for OAuth login
   - Upon successful login, JWT token is stored

3. **Manage Tasks**
   - Create new tasks with title, description, due date, priority
   - View all your tasks on the dashboard
   - Edit existing tasks
   - Mark tasks as complete
   - Delete tasks you no longer need

4. **Filter & Search**
   - Filter tasks by status (To Do, In Progress, Done)
   - Filter by priority (Low, Medium, High)
   - Search tasks by title or description

5. **Logout**
   - Click logout to clear session and return to login page

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "fullName": "John Doe"
}

Response: 201 Created
{
  "message": "User registered successfully"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### Task Endpoints (Requires Authentication)

**Note**: All task endpoints require `Authorization: Bearer <token>` header

#### Get All Tasks
```http
GET /tasks
Authorization: Bearer <your-jwt-token>

Response: 200 OK
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task manager project",
    "dueDate": "2026-03-01",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "createdAt": "2026-02-15T10:00:00",
    "updatedAt": "2026-02-15T10:00:00"
  }
]
```

#### Create Task
```http
POST /tasks
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "dueDate": "2026-03-01",
  "priority": "MEDIUM",
  "status": "TODO"
}

Response: 201 Created
{
  "id": 2,
  "title": "New Task",
  ...
}
```

#### Get Task by ID
```http
GET /tasks/{id}
Authorization: Bearer <your-jwt-token>

Response: 200 OK
{
  "id": 1,
  "title": "Complete project",
  ...
}
```

#### Update Task
```http
PUT /tasks/{id}
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "dueDate": "2026-03-15",
  "priority": "HIGH",
  "status": "DONE"
}

Response: 200 OK
{
  "id": 1,
  "title": "Updated Task",
  ...
}
```

#### Delete Task
```http
DELETE /tasks/{id}
Authorization: Bearer <your-jwt-token>

Response: 204 No Content
```

### Error Responses

```json
{
  "timestamp": "2026-02-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/tasks"
}
```

### Swagger Documentation

Access interactive API documentation at:
```
http://localhost:8080/swagger-ui.html
```

---

## 🌐 Deployment

### Backend Deployment (Railway)

1. **Prepare for Deployment**
   ```bash
   # Ensure production profile is configured
   # Create application-prod.properties with environment variables
   ```

2. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Initialize project
   railway init

   # Add PostgreSQL database
   railway add postgresql

   # Deploy
   railway up
   ```

3. **Configure Environment Variables** (Railway Dashboard)
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=your-production-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```

4. **Update OAuth Redirect URI**
   - Go to Google Cloud Console
   - Add production URL to authorized redirect URIs
   - Example: `https://your-app.railway.app/login/oauth2/code/google`

### Frontend Deployment (Vercel)

1. **Prepare for Deployment**
   ```bash
   # Update API base URL in .env.production
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login
   vercel login

   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables** (Vercel Dashboard)
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

### Alternative Deployment Options

- **Backend**: Render, AWS EC2, Heroku, DigitalOcean
- **Frontend**: Netlify, GitHub Pages, AWS S3 + CloudFront
- **Database**: ElephantSQL, AWS RDS, DigitalOcean Managed Databases

---

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=TaskServiceTest

# View coverage report
open target/site/jacoco/index.html
```

### Test Structure

```
src/test/java/
├── controller/
│   ├── AuthControllerTest.java
│   └── TaskControllerTest.java
├── service/
│   ├── UserServiceTest.java
│   └── TaskServiceTest.java
└── repository/
    ├── UserRepositoryTest.java
    └── TaskRepositoryTest.java
```

### Sample Test

```java
@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldCreateTask() throws Exception {
        String taskJson = """
            {
                "title": "Test Task",
                "description": "Test Description",
                "priority": "HIGH",
                "status": "TODO"
            }
            """;
        
        mockMvc.perform(post("/api/tasks")
                .header("Authorization", "Bearer " + validToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(taskJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Test Task"));
    }
}
```

### Frontend Tests (Optional)

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

---

## 🗺️ Roadmap

### Current Version (v1.0)
- ✅ User registration and authentication
- ✅ JWT-based security
- ✅ OAuth2 Google login
- ✅ CRUD operations for tasks
- ✅ Task filtering and search
- ✅ Responsive UI design
- ✅ Production deployment

### Future Enhancements (v2.0)

#### High Priority
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Task categories/projects
- [ ] Task sharing between users
- [ ] Email notifications for due tasks
- [ ] Task attachments (file upload)

#### Medium Priority
- [ ] Task comments and activity log
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Dashboard analytics (charts, statistics)
- [ ] Dark mode
- [ ] Mobile app (React Native)

#### Low Priority
- [ ] Task import/export (CSV, JSON)
- [ ] Calendar view
- [ ] Kanban board view
- [ ] Team collaboration features
- [ ] Integration with third-party apps (Google Calendar, Slack)
- [ ] AI-powered task suggestions

See [open issues](https://github.com/yourusername/task-manager/issues) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**
   - Write clean, well-documented code
   - Follow existing code style and conventions
   - Add tests for new features
   - Update documentation as needed

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add some AmazingFeature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes in detail

### Coding Standards

- **Java**: Follow Google Java Style Guide
- **JavaScript/React**: Follow Airbnb JavaScript Style Guide
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
- **Testing**: Maintain >70% code coverage
- **Documentation**: Update README and inline comments

### Code Review Process

1. Maintainers will review your PR within 2-3 business days
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in release notes

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

```
MIT License

Copyright (c) 2026 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📧 Contact

**Your Name** - [@your_twitter](https://twitter.com/your_twitter) - your.email@example.com

**Project Link**: [https://github.com/yourusername/task-manager](https://github.com/yourusername/task-manager)

**Live Demo**: [https://task-manager-demo.vercel.app](https://task-manager-demo.vercel.app)

**LinkedIn**: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

### Resources & Tutorials
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [React Documentation](https://react.dev)
- [Baeldung Spring Tutorials](https://www.baeldung.com/spring-boot)
- [JWT.io](https://jwt.io/)

### Tools & Libraries
- [Spring Initializr](https://start.spring.io/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Railway](https://railway.app/)
- [Vercel](https://vercel.com/)

### Community
- Stack Overflow community for troubleshooting
- Spring Boot Subreddit for discussions
- React Discord community for frontend help

### Inspiration
- [Todoist](https://todoist.com/) - Task management inspiration
- [Trello](https://trello.com/) - UI/UX patterns
- Various open-source task managers on GitHub

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/task-manager?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/task-manager?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/task-manager)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/task-manager)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/task-manager)

---

<div align="center">

**Built with ❤️ by [Nabin Oli](https://github.com/yourusername)**

If you found this project helpful, please consider giving it a ⭐!

[⬆ Back to Top](#task-manager---full-stack-web-application)

</div>
