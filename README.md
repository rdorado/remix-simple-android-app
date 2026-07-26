# Simple Notes - Full Stack Android & .NET 10 REST API Backend

A clean, modern note-taking application featuring a **Native Jetpack Compose Android App** connected to a **.NET Core 10 Web API** backend powered by **PostgreSQL**.

---

## 🚀 Quick Start Guide

### Option A: Run Backend using Docker Compose (Recommended)

1. Make sure **Docker** and **Docker Compose** are installed on your machine.
2. In the project root, run:
   ```bash
   docker-compose up --build
   ```
3. The services will start:
   - **PostgreSQL Database**: Port `5432`
   - **.NET Core 10 Web API**: Port `5000`
   - **Swagger UI**: Accessible at `http://localhost:5000`

---

### Option B: Run Backend manually with .NET SDK

1. Ensure **PostgreSQL** is running locally on port `5432` with database `simplenotesdb`.
2. Execute initial database setup:
   ```bash
   psql -U postgres -d simplenotesdb -f init-db.sql
   ```
3. Start the .NET Core 10 Web API:
   ```bash
   cd backend/SimpleNotesApi
   dotnet run
   ```

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
