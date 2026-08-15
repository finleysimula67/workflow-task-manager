# WorkFlow

A full-stack task management application built for organizing tasks, tracking progress, and collaborating with teams.

## Overview

WorkFlow provides a simple workspace for managing everyday tasks with secure authentication, task organization, collaboration, and administration.

## Features

- Task management
- Categories, priorities, and statuses
- JWT authentication
- Google OAuth2
- Comments and file attachments
- Notifications and activity logs
- User profiles
- Role-based admin controls

## Built With

**Frontend:** React · TypeScript · Vite · Tailwind CSS

**Backend:** Java 21 · Spring Boot · Spring Security · Maven

**Database:** PostgreSQL

**Deployment:** Vercel · Render · Docker

## Local Development

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

Configure the required environment variables using the provided `.env.example` files.

## Testing

### Backend

```bash
cd backend
mvn test
```

### Frontend

```bash
cd frontend
npm run test:run
```

## Project Status

Active development.

## License

This project is licensed under the [MIT License](LICENSE).
