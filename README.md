# WorkFlow

A full-stack task management application for organizing work, tracking progress, and collaborating with teams.

## Overview

WorkFlow provides a centralized workspace for managing tasks and team workflows. It includes secure authentication, task organization, collaboration features, notifications, and administrative controls.

The project is structured as a separate React frontend and Spring Boot backend, backed by PostgreSQL.

## Features

- Task management and organization
- Categories, priorities, and task statuses
- JWT-based authentication
- Google OAuth 2.0 authentication
- Comments and file attachments
- Notifications and activity tracking
- User profiles
- Role-based administrative controls

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Java 21, Spring Boot, Spring Security, Maven |
| Database | PostgreSQL |
| Authentication | JWT, Google OAuth 2.0 |
| Deployment | Vercel, Render |
| Containerization | Docker |

## Project Structure

```text
workflow-task-manager/
├── workflow-task-manager-backend/    # Spring Boot backend
├── workflow-task-manager-frontend/   # React frontend
├── docker-compose.yml                # Local development services
├── render.yaml                       # Render deployment configuration
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Java 21
- Maven
- Node.js 20+
- npm
- PostgreSQL
- Docker (optional)

### Backend

```bash
cd workflow-task-manager-backend
mvn spring-boot:run
```

The backend runs by default at:

```text
http://localhost:8080
```

### Frontend

```bash
cd workflow-task-manager-frontend
npm install
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

### Environment Variables

Configure the required environment variables using the provided `.env.example` files before running the application.

The backend requires configuration for items such as:

- PostgreSQL database
- JWT secret
- Google OAuth credentials
- Mail credentials
- Frontend URL

## Docker

The project includes a Docker Compose configuration for running the application stack locally.

```bash
docker compose up --build
```

To stop the services:

```bash
docker compose down
```

## Testing

### Backend

```bash
cd workflow-task-manager-backend
mvn test
```

### Frontend

```bash
cd workflow-task-manager-frontend
npm run test:run
```

## Deployment

The application uses separate deployment platforms for the frontend and backend:

- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL

Deployment configuration for the backend is maintained in `render.yaml`.

## Project Status

Active development.

## License

This project is licensed under the [MIT License](LICENSE).
```
