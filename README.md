# Expense Tracker (MERN)

A production-structured MERN monorepo for a **Personal Expense Tracking App** with TypeScript, MongoDB, Express, React, and a clean modular backend.

## Overview

- **Backend (apps/api):** Express + TypeScript, MongoDB/Mongoose, JWT auth, Zod validation, modular routes (auth, categories, expenses, summary).
- **Frontend (apps/web):** React + Vite + TypeScript, Tailwind CSS, React Router, TanStack Query, Recharts for dashboard.

Features: user registration/login, categories CRUD, expenses CRUD with month/category filters, monthly summary with category breakdown and recent expenses.

## Tech stack

| Layer    | Stack |
|----------|--------|
| Backend  | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod, morgan |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router, TanStack React Query, Recharts |

## Setup (without Docker)

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas connection string)

### Steps

1. **Clone and install**

   ```bash
   cd expense-tracker-mern
   npm install
   ```

2. **Environment**

   - Root (optional for local dev): copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET` if you use them from root.
   - API: `cp apps/api/.env.example apps/api/.env`  
     Set `MONGO_URI`, `JWT_SECRET`. Optionally `PORT=5000`, `CORS_ORIGIN=http://localhost:5173`.
   - Web: `cp apps/web/.env.example apps/web/.env`  
     Set `VITE_API_URL=http://localhost:5000/api`.

3. **Run**

   ```bash
   npm run dev
   ```

   This starts both the API and the web app (API on port 5000, web on 5173).

4. **Open**

   - Frontend: http://localhost:5173  
   - Register a user; default categories (Food, Travel, Shopping, Bills) are created automatically.

### Run API or Web only

```bash
npm run dev --workspace=apps/api   # API only on port 5000
npm run dev --workspace=apps/web   # Web only on port 5173
```

## Run everything in Docker (recommended)

No need to install Node or MongoDB locally. Everything runs in containers.

1. **Optional:** set a JWT secret in a `.env` file at the repo root:

   ```env
   JWT_SECRET=your-secret-key
   ```

   If you skip this, the default `change-me-in-production` is used (fine for local use).

2. **Build and start all services** (MongoDB + API + Web):

   ```bash
   docker-compose up --build
   ```

3. **Open the app:** http://localhost:5173  

   - Register a user; default categories are created automatically.  
   - API is at http://localhost:5001 (e.g. http://localhost:5001/api/health). Port 5001 is used to avoid conflict with macOS AirPlay (5000).  
   - MongoDB is internal (port 27017 exposed only if you need to connect from the host).

**Useful commands:**

```bash
docker-compose up -d          # Run in background
docker-compose down           # Stop and remove containers
docker-compose down -v        # Also remove MongoDB data volume
```

## How to run tests

No tests are included in this repo. To add them later:

- **API:** e.g. Jest or Vitest for unit/integration tests; supertest for routes.
- **Web:** e.g. Vitest + React Testing Library.

Placeholder commands you could add:

- Root: `npm run test` → run tests in all workspaces.
- API: `npm run test` in `apps/api`.
- Web: `npm run test` in `apps/web`.

## API summary

Base URL: `/api`

- **Auth:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me` (Bearer).
- **Categories:** `GET/POST /categories`, `PUT/DELETE /categories/:id` (Bearer).
- **Expenses:** `GET/POST /expenses`, `PUT/DELETE /expenses/:id` (Bearer); GET supports `?month=YYYY-MM&page=&limit=&categoryId=`.
- **Summary:** `GET /summary?month=YYYY-MM` (Bearer).

Full request/response examples: [docs/API.md](docs/API.md).

## Repo structure

```
expense-tracker-mern/
  apps/
    api/          # Express API
    web/          # React Vite app
  docs/
    API.md
    AI_USAGE.md
  package.json    # root workspace
  docker-compose.yml
```

See the spec in your project brief for the full folder layout.
