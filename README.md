<div align="center">

# ✦ WorkFlow

**A fast, secure, and modern task management platform.**  
Built for individuals and teams who want clarity without the clutter.

[![Java 17+](https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=java)](https://adoptium.net/)
[![Spring Boot 3.x](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React 18+](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-black?style=flat-square)](https://workflow-seven-steel.vercel.app)

[**Live Demo**](https://workflow-seven-steel.vercel.app) · [**API Docs**](#-api-reference) · [**Report a Bug**](../../issues) · [**Request a Feature**](../../issues)

</div>

---

## Overview

WorkFlow is a full-stack task management platform with JWT + OAuth2 authentication, file attachments, comments, categories, role-based admin controls, and a full public-facing landing site — all in a single monorepo.

---

## Project Structure

```
workflow/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── resources/
│       │   │   ├── application.yml
│       │   │   └── banner.txt
│       │   └── java/com/nabin/workflow/
│       │       ├── WorkFlowApplication.java
│       │       ├── config/
│       │       │   ├── SecurityConfig.java
│       │       │   └── WebConfig.java
│       │       ├── controller/
│       │       │   ├── AdminController.java
│       │       │   ├── AuthController.java
│       │       │   ├── CategoryController.java
│       │       │   ├── CommentController.java
│       │       │   ├── FileAttachmentController.java
│       │       │   ├── TaskController.java
│       │       │   └── UserProfileController.java
│       │       ├── dto/
│       │       │   ├── common/
│       │       │   │   ├── ApiResponse.java
│       │       │   │   └── PageMetadata.java
│       │       │   ├── request/
│       │       │   │   ├── CategoryRequestDTO.java
│       │       │   │   ├── ChangePasswordDTO.java
│       │       │   │   ├── CommentRequestDTO.java
│       │       │   │   ├── ForgotPasswordRequest.java
│       │       │   │   ├── RefreshTokenRequest.java
│       │       │   │   ├── ResetPasswordRequest.java
│       │       │   │   ├── TaskFilterDTO.java
│       │       │   │   ├── TaskRequestDTO.java
│       │       │   │   ├── TaskUpdateDTO.java
│       │       │   │   ├── UpdateProfileDTO.java
│       │       │   │   ├── UserLoginDTO.java
│       │       │   │   └── UserRegistrationDTO.java
│       │       │   └── response/
│       │       │       ├── CategoryResponseDTO.java
│       │       │       ├── CommentResponseDTO.java
│       │       │       ├── FileAttachmentResponseDTO.java
│       │       │       ├── LoginResponseDTO.java
│       │       │       ├── RefreshTokenResponse.java
│       │       │       ├── RoleResponseDTO.java
│       │       │       ├── TaskResponseDTO.java
│       │       │       ├── TaskStatsDTO.java
│       │       │       ├── UserProfileDTO.java
│       │       │       └── UserResponseDTO.java
│       │       ├── entities/
│       │       │   ├── AuthProvider.java
│       │       │   ├── Category.java
│       │       │   ├── Comment.java
│       │       │   ├── FileAttachment.java
│       │       │   ├── PasswordResetToken.java
│       │       │   ├── RefreshToken.java
│       │       │   ├── Role.java
│       │       │   ├── Task.java
│       │       │   ├── TaskPriority.java
│       │       │   ├── TaskStatus.java
│       │       │   ├── User.java
│       │       │   └── VerificationToken.java
│       │       ├── exception/
│       │       │   ├── DuplicateResourceException.java
│       │       │   ├── ErrorResponse.java
│       │       │   ├── FileStorageException.java
│       │       │   ├── InvalidBusinessRuleException.java
│       │       │   ├── ResourceNotFoundException.java
│       │       │   ├── TaskNotFoundException.java
│       │       │   ├── UnauthorizedException.java
│       │       │   └── global/
│       │       │       └── GlobalExceptionHandler.java
│       │       ├── mapper/
│       │       │   └── DTOMapper.java
│       │       ├── repository/
│       │       │   ├── CategoryRepository.java
│       │       │   ├── CommentRepository.java
│       │       │   ├── FileAttachmentRepository.java
│       │       │   ├── PasswordResetTokenRepository.java
│       │       │   ├── RefreshTokenRepository.java
│       │       │   ├── RoleRepository.java
│       │       │   ├── TaskRepository.java
│       │       │   ├── UserRepository.java
│       │       │   └── VerificationTokenRepository.java
│       │       ├── security/
│       │       │   ├── jwt/
│       │       │   │   ├── JwtAuthenticationFilter.java
│       │       │   │   └── JwtTokenProvider.java
│       │       │   ├── oauth2/
│       │       │   │   ├── OAuth2AuthenticationFailureHandler.java
│       │       │   │   ├── OAuth2AuthenticationSuccessHandler.java
│       │       │   │   ├── OAuth2UserService.java
│       │       │   │   └── user/
│       │       │   │       ├── GoogleOAuth2UserInfo.java
│       │       │   │       ├── OAuth2UserInfo.java
│       │       │   │       └── OAuth2UserInfoFactory.java
│       │       │   └── user/
│       │       │       ├── AuthenticationService.java
│       │       │       ├── CustomUserDetailsService.java
│       │       │       └── UserPrincipal.java
│       │       ├── services/
│       │       │   ├── EmailService.java
│       │       │   ├── RefreshTokenService.java
│       │       │   ├── interfaces/
│       │       │   │   ├── CategoryService.java
│       │       │   │   ├── CommentService.java
│       │       │   │   ├── FileAttachmentService.java
│       │       │   │   ├── FileStorageService.java
│       │       │   │   ├── TaskService.java
│       │       │   │   └── UserService.java
│       │       │   └── impl/
│       │       │       ├── CategoryServiceImpl.java
│       │       │       ├── CommentServiceImpl.java
│       │       │       ├── FileAttachmentServiceImpl.java
│       │       │       ├── FileStorageServiceImpl.java
│       │       │       ├── TaskServiceImpl.java
│       │       │       └── UserServiceImpl.java
│       │       ├── specification/
│       │       │   └── TaskSpecification.java
│       │       └── util/
│       │           └── SecurityUtil.java
│       └── test/java/com/nabin/workflow/
│           └── TaskManagerApplicationTests.java
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── eslint.config.js
    ├── .env.example
    ├── public/
    │   ├── index.html
    │   └── vite.svg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   ├── axios.js
        │   ├── authApi.js
        │   ├── taskApi.js
        │   ├── categoryApi.js
        │   ├── commentApi.js
        │   └── attachmentApi.js
        ├── assets/
        │   ├── logo.png
        │   ├── favicon.png
        │   └── finley.jpg
        ├── components/
        │   ├── AttachmentList.jsx
        │   ├── CommentSection.jsx
        │   ├── EmailVerificationBanner.jsx
        │   ├── FileUpload.jsx
        │   ├── PublicNavbar.jsx
        │   ├── PublicFooter.jsx
        │   ├── RecentTaskItem.jsx
        │   ├── StatCard.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskModal.jsx
        │   ├── TaskStats.jsx
        │   ├── common/
        │   │   ├── Button.jsx
        │   │   ├── Input.jsx
        │   │   ├── Loader.jsx
        │   │   └── Modal.jsx
        │   ├── layout/
        │   │   ├── Layout.jsx
        │   │   ├── Navbar.jsx
        │   │   └── Sidebar.jsx
        │   ├── tasks/
        │   │   ├── TaskCard.jsx
        │   │   ├── TaskFilter.jsx
        │   │   ├── TaskForm.jsx
        │   │   └── TaskList.jsx
        │   └── categories/
        │       ├── CategoryForm.jsx
        │       └── CategoryList.jsx
        ├── context/
        │   └── ThemeContext.jsx
        ├── pages/
        │   ├── AdminDashboard.jsx
        │   ├── AuthCallback.jsx
        │   ├── Categories.jsx
        │   ├── Dashboard.jsx
        │   ├── ForgotPassword.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── ResendVerification.jsx
        │   ├── ResetPassword.jsx
        │   ├── Statistics.jsx
        │   ├── Tasks.jsx
        │   ├── UserDetails.jsx
        │   ├── UserProfile.jsx
        │   ├── VerifyEmail.jsx
        │   └── public/
        │       ├── LandingPage.jsx
        │       ├── Features.jsx
        │       ├── Pricing.jsx
        │       ├── About.jsx
        │       └── Contact.jsx
        ├── store/
        │   ├── authStore.js
        │   ├── taskStore.js
        │   └── categoryStore.js
        └── utils/
            ├── constants.js
            ├── helpers.js
            └── validation.js
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.x, Maven |
| Auth | Spring Security 6, JWT, OAuth2 (Google) |
| Database | PostgreSQL 14+, Spring Data JPA (Hibernate) |
| Frontend | React 18+, Vite, React Router DOM, Axios |
| Styling | Tailwind CSS |
| State | Zustand (store/) + React Context |
| DevOps | Docker, Docker Compose, Nginx |

---

## Getting Started

### Prerequisites

- Java 17+, Maven 3.6+
- Node.js 18+
- PostgreSQL 14+ **or** Docker

<div align="center">
  <sub>WorkFlow — keep your work moving.</sub>
</div>
