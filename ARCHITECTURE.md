# Architecture & Directory Organization

## Overview
Simple Notes has been structured into a clean **Client-Server Architecture**:
- **Frontend**: Native Android app written in Kotlin using Jetpack Compose, Retrofit, Moshi, and Room as an offline-first caching layer.
- **Backend**: RESTful Web API built on **.NET Core 10** utilizing Entity Framework Core.
- **Database**: Relational **PostgreSQL** database storing notes with indexing, category filters, and state timestamps.

---

## Proposed Directory Organization

```
.
├── app/                                # Android Mobile Client Application (Kotlin / Jetpack Compose)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/
│   │   │   │   ├── data/
│   │   │   │   │   ├── api/            # Retrofit REST Client & Data Transfer Objects
│   │   │   │   │   │   ├── ApiClient.kt       # OkHttp + Moshi + Retrofit Client
│   │   │   │   │   │   ├── NoteApiService.kt  # REST API Interface
│   │   │   │   │   │   └── NoteDtos.kt        # JSON Request / Response DTOs
│   │   │   │   │   ├── AppDatabase.kt         # Room Database Configuration
│   │   │   │   │   ├── NoteDao.kt             # Local Room DAO
│   │   │   │   │   ├── NoteEntity.kt          # Local Entity Definition
│   │   │   │   │   └── NoteRepository.kt      # Repository Pattern (REST Sync + Local Room Cache)
│   │   │   │   ├── ui/                 # ViewModels, Composables, & Material 3 Theme
│   │   │   │   └── MainActivity.kt
│   │   │   └── AndroidManifest.xml    # Permissions (INTERNET, Cleartext Traffic)
│   └── build.gradle.kts
│
├── backend/                            # .NET Core 10 Web API Backend
│   ├── SimpleNotesBackend.sln          # Visual Studio Solution File (combines API & Tests)
│   ├── SimpleNotesApi/
│   │   ├── Controllers/
│   │   │   └── NotesController.cs      # REST API Controllers (CRUD + Filtering + Patch)
│   │   ├── Data/
│   │   │   └── NotesDbContext.cs       # Entity Framework Core DbContext with Npgsql
│   │   ├── DTOs/
│   │   │   └── NoteDtos.cs             # C# DTO Definitions
│   │   ├── Models/
│   │   │   └── Note.cs                 # Domain Entity mapped to PostgreSQL table
│   │   ├── Properties/
│   │   │   └── launchSettings.json     # Development profiles
│   │   ├── appsettings.json            # Configuration & PostgreSQL Connection String
│   │   ├── Dockerfile                  # .NET 10 Multi-stage container build definition
│   │   └── SimpleNotesApi.csproj       # .NET 10 C# Project File
│   └── SimpleNotesApi.Tests/
│       ├── NotesControllerTests.cs     # Unit tests covering all REST endpoints (xUnit + EF In-Memory)
│       └── SimpleNotesApi.Tests.csproj # .NET 10 xUnit Test Project File
│
├── docker-compose.yml                  # Container Orchestration (PostgreSQL 16 + .NET 10 API)
├── init-db.sql                         # PostgreSQL Schema DDL & Initial Seed Script
├── ARCHITECTURE.md                     # Architecture & Organization Documentation
└── README.md                           # Setup & Developer Guide
```

---

## REST API Specification

| HTTP Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Query all notes (supports optional `query` and `category` query params) | - | `List<NoteResponseDto>` |
| `GET` | `/api/notes/{id}` | Get note by ID | - | `NoteResponseDto` |
| `POST` | `/api/notes` | Create a new note | `CreateNoteDto` | `NoteResponseDto` |
| `PUT` | `/api/notes/{id}` | Update existing note | `UpdateNoteDto` | `NoteResponseDto` |
| `PATCH` | `/api/notes/{id}/pin` | Toggle/Set pin status | `UpdatePinDto` | `NoteResponseDto` |
| `PATCH` | `/api/notes/{id}/complete` | Toggle/Set completion status | `UpdateCompletedDto` | `NoteResponseDto` |
| `DELETE` | `/api/notes/{id}` | Delete note by ID | - | `204 No Content` |
| `POST` | `/api/notes/seed` | Seed default sample notes | - | `List<NoteResponseDto>` |

---

## PostgreSQL Database Schema

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Personal',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    color_hex VARCHAR(20) NOT NULL DEFAULT '#FFF8E1',
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
