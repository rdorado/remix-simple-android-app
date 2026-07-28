# Simple Notes - Full Stack Android & .NET 10 REST API Backend

A clean, modern note-taking application featuring a **Native Jetpack Compose Android App** connected to a **.NET Core 10 Web API** backend powered by **PostgreSQL**.

---

## 🚀 Quick Start Guide

### Option A: Run Backend & Admin Portal using Docker Compose (Recommended)

1. Make sure **Docker** and **Docker Compose** are installed on your machine.
2. In the project root, run:
   ```bash
   docker-compose up --build
   ```
3. The services will start:
   - **PostgreSQL Database**: Port `5432`
   - **.NET Core 10 Web API**: Port `5000`
   - **Swagger UI**: Accessible at `http://localhost:5000`
   - **React TypeScript Admin Frontend**: Accessible at `http://localhost:3000`

---

## 🛠️ React TypeScript Admin Frontend (`./frontend`)

An administrative web application built with **React 18**, **TypeScript**, and **Vite** for database maintenance and live record management.

### Features:
- **Authentication**: Admin login portal with role scopes (`System Administrator` / `Data Auditor`).
- **Full CRUD Operations**: Create, view, update, and delete notes directly in PostgreSQL.
- **Quick Toggles**: One-click Pin / Unpin and Complete / Incomplete state updates.
- **Search & Filter**: Real-time searching across title & content, with category filtering.
- **View Modes**: Switch between Data Table view with sorting and Visual Card Grid view.
- **Database Utilities**: Seed sample database entries and review database connection health metrics.

### Running Frontend Locally (Dev Mode):
```bash
cd frontend
npm install
npm run dev
```
The admin app will launch at `http://localhost:3000` and automatically proxy API calls to `http://localhost:5000`.

### Building with Docker (`./frontend/Dockerfile`):
```bash
cd frontend
docker build -t simple-notes-admin-frontend .
docker run -p 3000:80 simple-notes-admin-frontend
```

---

### Option B: Run Backend manually with .NET SDK

1. Ensure **PostgreSQL** is running locally on port `5432` with database `simplenotesdb`.
2. Execute initial database setup:
   ```bash
   psql -U postgres -d simplenotesdb -f init-db.sql
   ```
3. Open `backend/SimpleNotesBackend.sln` in Visual Studio / JetBrains Rider, or run from terminal:
   ```bash
   cd backend
   dotnet run --project SimpleNotesApi
   ```

---

## 🧪 Running Backend Unit Tests

To run the xUnit test suite for the .NET 10 Web API across the solution:
```bash
cd backend
dotnet test SimpleNotesBackend.sln
```

The test suite covers:
- Querying all notes and filtering by category or keyword
- Retrieving individual notes by ID
- Creating, updating, and deleting notes
- Toggling pin (`isPinned`) and completion (`isCompleted`) status via PATCH requests
- Initial database seeding logic

---

## 📱 Connecting Android App to Backend

- When running the Android app in the **Android Emulator**, standard `localhost` on your host machine maps to **`http://10.0.2.2:5000/`**.
- The `ApiClient` in Android is pre-configured to connect to `http://10.0.2.2:5000/`.
- If testing on a physical device, update `ApiClient.baseUrl` to your machine's LAN IP address (e.g., `http://192.168.1.50:5000/`).

---

## 📁 Repository Structure

- `/app`: Android Application (Jetpack Compose, Retrofit, Room offline cache)
- `/backend/SimpleNotesApi`: ASP.NET Core 10 REST Web API project
- `/docker-compose.yml`: Container orchestration file
- `/init-db.sql`: PostgreSQL DDL schema & seed data
- `/ARCHITECTURE.md`: Complete architectural documentation & API specs
