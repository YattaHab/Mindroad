# MindRoad API

<p align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white"/>
  <img src="https://img.shields.io/badge/ASP.NET_Core-Web_API-blue?style=for-the-badge&logo=dotnet"/>
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge&logo=jsonwebtokens"/>
  <img src="https://img.shields.io/badge/Entity_Framework_Core-8.0-purple?style=for-the-badge"/>
</p>

A production-deployed RESTful Web API for a **structured learning platform** where users follow curated roadmaps across learning tracks, track their progress, earn certificates, and engage with a learning community.

🌐 **Live:** [mindroad.runasp.net](http://mindroad.runasp.net)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)

---

## Overview

MindRoad is a learning management platform API built to help users navigate structured learning paths. Users enroll in **Tracks**, progress through **Roadmaps** organized into **Levels** and **Topics**, consume **Resources**, and automatically earn **PDF Certificates** upon completion.

The project follows a clean **3-layer architecture** (Presentation → Business Logic → Data Access), with clear separation of concerns across three class library projects.

---

## Architecture

```
MindMapManager.WebAPI          → Controllers, Middleware, Program.cs
MindMapManager.Core            → Entities, DTOs, Service Interfaces, Service Implementations
MindMapManager.Infrastructure  → DbContext, Repository Implementations, EF Migrations
```

The system uses the **Repository Pattern** and **Dependency Injection** throughout, keeping services decoupled from data access concerns.

---

## Features

### 👤 Identity & Authentication
- JWT Bearer token authentication with **refresh token** rotation
- ASP.NET Core Identity with custom `ApplicationUser`
- Role-based authorization (`Admin` / `Member`)
- Password reset via email (MailKit + Gmail SMTP)
- Email uniqueness validation

### 📚 Learning Content
- Hierarchical content model: **Track → Roadmap → Level → Topic → Resource**
- Full CRUD for all content entities (Admin only)
- Paginated listing with search/filter for Tracks and Roadmaps
- Featured tracks sorted by enrollment count

### 📈 Progress Tracking
- Topic completion tracking per user
- Automatic level progress percentage calculation
- Roadmap-level progress aggregation
- Daily streak tracking updated on login and topic completion

### 🏆 Certificates
- **Auto-issued PDF certificates** when a user completes 100% of a roadmap
- PDF generation using **QuestPDF**
- Publicly verifiable certificates via unique certificate code
- Certificate download endpoint

### 💬 Community
- Threaded comments on Topics (comments + nested replies)
- Enrollment-gated access (only enrolled users can comment)
- Comment deletion by owner or Admin

### ⭐ Reviews & Bookmarks
- Users can review roadmaps after completing them (1–5 star rating)
- Resource bookmarking with paginated retrieval

### 🔔 Notifications
- In-app notifications (e.g., certificate issuance)
- Mark as read / mark all as read
- Unread count endpoint

### 🔍 Search
- Cross-entity search across Tracks, Roadmaps, and Topics in a single query

### 🛠️ Admin Dashboard
- User management: list, filter, ban/activate, change roles, delete
- Platform stats: total users, enrollments, certificates, comments, new signups

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core 8 |
| Database | Microsoft SQL Server |
| Authentication | JWT Bearer + ASP.NET Identity |
| PDF Generation | QuestPDF |
| Email | MailKit (Gmail SMTP) |
| Documentation | Swagger / OpenAPI (Swashbuckle) |
| Deployment | IIS (Windows hosting) |

---

## Project Structure

```
MindMap/
├── MindMap/                          # Web API layer
│   ├── Controllers/                  # API controllers
│   ├── MiddleWares/                  # Global exception handling middleware
│   └── Program.cs                    # DI registration & pipeline configuration
│
├── MindMapManager.Core/              # Business logic layer
│   ├── DTOs/                         # Request/Response models
│   ├── Entities/                     # Domain entities & EF view models
│   ├── Exceptions/                   # Custom exception types
│   ├── Helpers/                      # PDF generator, paged result helper
│   ├── RepositoryContracts/          # Repository interfaces
│   ├── ServiceContracts/             # Service interfaces
│   └── Services/                     # Service implementations
│
└── MindMapManager.Infrastructure/    # Data access layer
    ├── DatabaseContext/              # EF DbContext with full model configuration
    ├── Migrations/                   # EF migrations
    └── Repository/                   # Repository implementations
```

---

## API Reference

### Authentication — `/api/account`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login and receive JWT + refresh token |
| `GET` | `/logout` | 🔒 | Logout |
| `POST` | `/generate-new-jwt-token` | Public | Refresh access token |
| `POST` | `/forgot-password` | Public | Send password reset email |
| `POST` | `/reset-password` | Public | Reset password with token |
| `GET` | `/is-email-already-registered` | Public | Email availability check |

### Tracks — `/api/track`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Public | Get all tracks (paginated, searchable) |
| `GET` | `/Featured-tracks` | Public | Get most-enrolled tracks |
| `GET` | `/{id}` | Public | Get roadmaps in a track |
| `POST` | `/{id}/enroll` | 🔒 Member | Enroll in a track |
| `GET` | `/{id}/enrollment-status` | 🔒 | Check enrollment status |
| `POST` | `/add` | 🔒 Admin | Create a track (with image upload) |
| `PUT` | `/{id}` | 🔒 Admin | Update a track |
| `DELETE` | `/{id}` | 🔒 Admin | Delete a track |

### Roadmaps — `/api/roadmap`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Public | Get all roadmaps (paginated, searchable) |
| `GET` | `/{id}` | Public | Get full roadmap details with levels, topics, and resources |
| `POST` | `/` | 🔒 Admin | Create a roadmap |
| `PUT` | `/{id}` | 🔒 Admin | Update a roadmap |
| `DELETE` | `/{id}` | 🔒 Admin | Delete a roadmap |

### Progress — `/api/progress`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/roadmap/{roadmapId}` | 🔒 Member | Get progress for a roadmap |
| `POST` | `/complete-topic/{topicId}` | 🔒 Member | Mark a topic as complete |
| `DELETE` | `/complete-topic/{topicId}` | 🔒 Member | Unmark a completed topic |

### Certificates — `/api/certificates`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | 🔒 | Get my certificates |
| `GET` | `/{id}` | 🔒 | Get certificate by ID |
| `GET` | `/{id}/download` | 🔒 | Download certificate PDF |
| `GET` | `/verify/{code}` | Public | Verify a certificate by code |

### Community — `/api/topic/{id}/comments`, `/api/comments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/topic/{id}/comments` | 🔒 | Get threaded comments for a topic |
| `POST` | `/api/topic/{id}/comments` | 🔒 | Add a comment |
| `POST` | `/api/comments/{id}/reply` | 🔒 | Reply to a comment |
| `DELETE` | `/api/comments/{id}` | 🔒 | Delete a comment |

> Users must be enrolled in the track to access community features.

### Additional Endpoints

| Resource | Base Path | Auth |
|----------|-----------|------|
| Levels | `/api/level` | Public (GET), Admin (CUD) |
| Topics | `/api/topic` | Public (GET), Admin (CUD) |
| Resources | `/api/resource` | Public (GET), Admin (CUD) |
| Reviews | `/api/roadmap/{id}/reviews` | Public (GET), Member (POST) |
| Bookmarks | `/api/bookmarks` | 🔒 Member |
| Notifications | `/api/notifications` | 🔒 |
| Search | `/api/search?q=` | Public |
| Admin | `/api/admin` | 🔒 Admin |
| Users | `/api/users/profile` | 🔒 Member |

---

## Authentication

The API uses **JWT Bearer tokens** with refresh token rotation.

```http
Authorization: Bearer <your_access_token>
```

**Token flow:**
1. `POST /api/account/login` → receive `token` + `refreshToken`
2. Use `token` in `Authorization` header for protected routes
3. When token expires, call `POST /api/account/generate-new-jwt-token` with both tokens to get a new pair

---

## Database Schema

The data model supports a hierarchical learning structure:

```
Track
 └── Roadmap
      └── Level
           └── Topic
                └── Resource

User
 ├── UserTrack (enrollment)
 ├── Progress (per level)
 ├── CompletedTopic
 ├── Certificate
 ├── Review
 ├── Bookmark (Resource)
 ├── Comment / UserComment
 └── Notification
```

The database also includes several **SQL views** (`vw_leaderboard`, `vw_roadmap_stats`, `vw_user_progress`, etc.) mapped as keyless entities in EF Core for efficient reporting queries.

---

## Error Handling

All exceptions are caught by a global **`ExceptionHandlingMiddleware`** and mapped to appropriate HTTP responses:

| Exception | Status Code |
|-----------|-------------|
| `BadRequestException` | `400 Bad Request` |
| `NotFoundException` | `404 Not Found` |
| `ConflictException` | `409 Conflict` |
| `ForbiddenException` | `403 Forbidden` |
| Unhandled `Exception` | `500 Internal Server Error` |

---

## Getting Started

### Prerequisites

- .NET 8 SDK
- SQL Server (local or remote)
- Visual Studio 2022 or VS Code

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd MindMap

# Restore packages
dotnet restore

# Apply database migrations
dotnet ef database update --project MindMapManager.Infrastructure --startup-project MindMap

# Run the API
dotnet run --project MindMap
```

Swagger UI will be available at: `https://localhost:7281/swagger`

---

## Environment Configuration

Configure `appsettings.json` in the `MindMap` project:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=mind_road;..."
  },
  "Jwt": {
    "Issuer": "https://localhost:7281",
    "Audience": "https://localhost:4200",
    "Expiration_Days": 7,
    "SecretKey": "<your-secret-key>"
  },
  "RefreshToken": {
    "Expiration_Days": 30
  },
  "EmailConfiguration": {
    "From": "<your-email>",
    "MailServer": "smtp.gmail.com",
    "MailPort": 465,
    "UserName": "Display Name",
    "Password": "<app-password>"
  }
}
```

---

## Authorization Roles

| Role | Description |
|------|-------------|
| `Member` | Assigned on registration. Can enroll, track progress, review, bookmark, and interact with the community. |
| `Admin` | Full platform access including content management, user administration, and dashboard analytics. |

---

<p align="center">Built with ASP.NET Core 8 · Deployed at <a href="http://mindroad.runasp.net">mindroad.runasp.net</a></p>
