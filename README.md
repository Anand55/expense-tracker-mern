# Expense Tracker (MERN)

Monorepo for a **Personal Expense Tracking App**: backend in `apps/api` (Express + TypeScript + MongoDB Atlas), frontend in `apps/web` (Vite + React + TypeScript).

---

## Live URLs

| App | URL |
|-----|-----|
| **Frontend (Vercel)** | https://expense-tracker-mern-web.vercel.app |
| **Backend (Render)** | https://expense-tracker-api-grka.onrender.com |
| **Backend Health** | https://expense-tracker-api-grka.onrender.com/api/health |

> **Note:** The backend on Render goes to sleep after about 15 minutes of no activity. If you want to try the app live, let me know and I can wake the services.

---

## Architecture

```
Browser (Vercel) → API (Render) → MongoDB Atlas
```

- **Frontend** (Vercel): Serves the React app; calls the backend API.
- **Backend** (Render): Express API; auth, categories, expenses, summary.
- **Database**: MongoDB Atlas (hosted).

---

## Environment Variables

### Backend (Render)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string (from Atlas: Cluster → Connect → Drivers; do not paste real value in README). Format: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret used to sign JWTs (e.g. a long random string). |
| `CORS_ORIGIN` | Allowed origins, comma-separated. Example: `http://localhost:5173,https://expense-tracker-mern-web.vercel.app` |

### Frontend (Vercel)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL. Production: `https://expense-tracker-api-grka.onrender.com/api` |

---

## Deployment Steps

### Backend (Render)

1. Create a **Web Service** and connect this repo.
2. **Root Directory:** `apps/api`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm run start`
5. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN` (see above). Render sets `PORT` automatically.
6. Deploy. Verify: open **Backend Health** URL; expect `{ "status": "ok", "db": "connected" }`.

### Frontend (Vercel)

1. Create a **Vercel Project** and connect this repo.
2. **Root Directory:** `apps/web`
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Set **Environment Variable:** `VITE_API_URL` = `https://expense-tracker-api-grka.onrender.com/api`
7. Deploy.

---

## Local Development

**Prerequisites:** Node.js 18+, MongoDB (local or Atlas).

1. **Install (from repo root):**
   ```bash
   npm install
   ```

2. **Environment (copy examples and fill in):**
   - Backend: `cp apps/api/.env.example apps/api/.env`  
     Set `MONGO_URI`, `JWT_SECRET`; optional `PORT`, `CORS_ORIGIN`.
   - Frontend: `cp apps/web/.env.example apps/web/.env`  
     Set `VITE_API_URL=http://localhost:5001/api` (or your local API port).

3. **Run both API and web:**
   ```bash
   npm run dev
   ```
   - API: http://localhost:5001 (or `PORT` from `.env`)
   - Web: http://localhost:5173

4. **Run one app only:**
   ```bash
   npm run dev --workspace=apps/api
   npm run dev --workspace=apps/web
   ```

---

## Troubleshooting

- **Render free tier:** The service may sleep after inactivity. The first request after sleep can take 30–60 seconds; subsequent requests are fast.
- **CORS errors:** Ensure `CORS_ORIGIN` on Render includes your frontend origin (e.g. `https://expense-tracker-mern-web.vercel.app`). Use comma-separated values for multiple origins.
- **MongoDB connection fails:** In Atlas, check **Network Access** (allow your IP or `0.0.0.0/0` for Render) and **Database Access** (user has read/write). If the password has special characters, use URL encoding in `MONGO_URI`.

---

## Tech Stack

| Layer | Stack |
|-------|--------|
| Backend | Node.js, Express, TypeScript, MongoDB Atlas, Mongoose, JWT, bcrypt, Zod, morgan |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, Recharts |

---

## API Summary

Base path: `/api`. See [docs/API.md](docs/API.md) for details.

- **Auth:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me` (Bearer).
- **Categories:** `GET/POST /categories`, `PUT/DELETE /categories/:id` (Bearer).
- **Expenses:** `GET/POST /expenses`, `PUT/DELETE /expenses/:id` (Bearer); GET supports `?month=YYYY-MM&page=&limit=&categoryId=`.
- **Summary:** `GET /summary?month=YYYY-MM` (Bearer).

---

## Repo Structure

```
expense-tracker-mern/
  apps/
    api/          # Express API (deploy to Render)
    web/          # React Vite app (deploy to Vercel)
  docs/
    API.md
    AI_USAGE.md
  package.json    # root workspace
  docker-compose.yml
```

---

## Docker (optional)

From repo root:

```bash
docker-compose up --build
```

App: http://localhost:5173. API: http://localhost:5001. See `docker-compose.yml` for ports and env.

---

## Tools & AI Usage

- **Frontend:** [Bolt](https://bolt.new) was used for UI and frontend structure.
- **Backend:** [Cursor](https://cursor.com) was used for API implementation, config, and deployment setup.
- **Prompts:** [ChatGPT](https://chat.openai.com) was used to draft prompts that were then pasted into Cursor.

**Example prompts used with Cursor:**

- **Backend:** Verify MongoDB Atlas connection locally; ensure dotenv loads early, add `connectDB()` and health route; prepare backend for Render (PORT, CORS, env vars, build/start scripts).
- **Frontend:** Add confirm password on registration and validate match before submit; add Vercel rewrites so SPA routes (e.g. `/dashboard`) serve `index.html` and avoid 404 on refresh.

**Bolt prompt (frontend UI refresh):**

<details>
<summary>Click to expand</summary>

```
You are working on my existing GitHub repository and must implement a UI/UX redesign WITHOUT changing functionality.

## Repository
Repo: Anands5/expense-tracker-mern

## Branch Rules (VERY IMPORTANT)
- Work ONLY on branch: `ui-refresh`
- Do NOT commit to `main`
- All changes must be applied to `ui-refresh`
- If GitHub integration supports PR creation, open a PR from:
  ui-refresh → main
- If direct push is not supported, output the full file changes so I can apply them locally on `ui-refresh`.

## Scope of Changes
Modify ONLY the frontend located at:
apps/web

DO NOT change:
- apps/api (backend must remain untouched)
- API routes
- Request/response formats
- Authentication logic
- Environment variable usage
- React Query hooks or axios client logic
- Routing paths

## These routes MUST remain identical:
- /login
- /register
- /dashboard
- /expenses
- /categories

## Backend is already deployed and must not break:
API Base URL comes from:
VITE_API_URL=https://expense-tracker-api-grka.onrender.com/api

Do not hardcode URLs.

## Functional Constraints (Non-Negotiable)
This is a VISUAL redesign only.
No feature additions.
No feature removals.
No schema changes.
No state-management rewrites.

Users must still be able to:
- Register/Login
- Add/Edit/Delete expenses
- Manage categories
- View monthly dashboard summary

## UI/UX Goals
Redesign the interface to look like a modern SaaS product:
- Clean layout with top navigation + content container
- Consistent spacing, typography, and hierarchy
- Card-based dashboard
- Improved forms with labels + validation states
- Styled tables with hover, empty states, loading states
- Better buttons, icons, and action placement
- Responsive behavior (mobile friendly)
- Use Tailwind (already present)
- You may introduce lightweight UI primitives if needed, but keep dependencies minimal

## Technical Rules
- TypeScript must remain valid.
- Project must still build using:
  npm run build (inside apps/web)
- Do not change project structure.
- Do not convert to another framework.
- Keep this a Vite + React + Tailwind project.

## Deliverables
1. Updated UI code only inside apps/web.
2. List of files changed.
3. Any new dependencies added (if any).
4. Confirmation build succeeds.
5. No backend or API logic touched.

Start by analyzing apps/web and then perform a safe visual refactor.
```
</details>

**Cursor prompt (initial repo build):**

<details>
<summary>Click to expand</summary>

```
You are building a **production-structured MERN monorepo** for a **Personal Expense Tracking App**.

## Absolute rules
- Create **ONE GitHub-ready monorepo** with **frontend + backend** inside it.
- Use **TypeScript** in both backend and frontend.
- Do **NOT** generate pseudo code. Write real runnable code.
- Keep the app simple, but structure it like a production repo.
- Include clean folder structure, env examples, validation, error handling.
- Include **docs/AI_USAGE.md** documenting prompts/responses (leave placeholders where I can paste actual chat logs).
- Provide commands to run locally.
- Make everything work end-to-end.

---

# 1) Repo Structure (must match)

expense-tracker-mern/
  README.md
  .gitignore
  .editorconfig
  .env.example
  package.json                      # root workspace
  docker-compose.yml                # optional but recommended
  apps/
    api/
      package.json
      tsconfig.json
      .env.example
      src/
        app.ts
        server.ts
        config/
          env.ts
          db.ts
        middleware/
          auth.ts
          errorHandler.ts
          validate.ts
        utils/
          httpError.ts
          logger.ts
        modules/
          auth/
            auth.routes.ts
            auth.controller.ts
            auth.service.ts
            auth.schema.ts
          categories/
            categories.routes.ts
            categories.controller.ts
            categories.service.ts
            categories.schema.ts
            categories.model.ts
          expenses/
            expenses.routes.ts
            expenses.controller.ts
            expenses.service.ts
            expenses.schema.ts
            expenses.model.ts
          summary/
            summary.routes.ts
            summary.controller.ts
            summary.service.ts
    web/
      package.json
      vite.config.ts
      tsconfig.json
      .env.example
      src/
        main.tsx
        App.tsx
        api/
          client.ts                 # axios instance
          auth.ts
          categories.ts
          expenses.ts
          summary.ts
        auth/
          AuthProvider.tsx
          ProtectedRoute.tsx
        pages/
          Login.tsx
          Register.tsx
          Dashboard.tsx
          Expenses.tsx
          Categories.tsx
        components/
          layout/
            Navbar.tsx
          expenses/
            ExpenseFormModal.tsx
            ExpenseTable.tsx
          categories/
            CategoryFormModal.tsx
          common/
            Loading.tsx
            ErrorState.tsx
        routes/
          index.tsx
        utils/
          month.ts
  docs/
    API.md
    AI_USAGE.md

---

# 2) Tech Stack (use exactly these)
## Backend (apps/api)
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT auth (access token)
- Password hashing using bcrypt
- Validation using Zod
- Logging using morgan (dev) + simple console logger util
- Use dotenv for env

## Frontend (apps/web)
- React + Vite
- TypeScript
- Tailwind CSS (simple clean UI)
- React Router
- TanStack React Query for server state
- Minimal charting: use Recharts OR if too much, show breakdown as tables (prefer Recharts if easy)

---

# 3) Functional Requirements
## Auth
- Register and Login (email + password)
- Store JWT in localStorage
- Add "me" endpoint to verify session
- Frontend uses ProtectedRoute for authenticated pages

## Categories
- CRUD categories
- Category is always scoped to logged-in user
- Enforce unique category name per user (DB index)
- Prevent deleting a category if it is referenced by existing expenses (return 409 with error message)

## Expenses
- CRUD expenses
- Each expense has: amount, date, categoryId, note(optional)
- Expenses are scoped to logged-in user
- Add endpoint to list expenses by month: GET /api/expenses?month=YYYY-MM&page=1&limit=20&categoryId=
- Sort by date desc
- Pagination supported
- Server validates inputs

## Monthly Summary Dashboard
- GET /api/summary?month=YYYY-MM
- Response includes:
  - totalSpend
  - count
  - byCategory: [{ categoryId, categoryName, total }]
- Implement using Mongo aggregation (group by categoryId)
- Dashboard page shows:
  - Month selector
  - Total spend
  - Category breakdown (pie/bar or table)
  - Recent expenses list (top 5)

---

# 4) Data Models (Mongo/Mongoose)
## User
- email (unique, indexed)
- passwordHash
- createdAt

## Category
- userId (indexed)
- name
- createdAt
- Unique compound index: { userId: 1, name: 1 }

## Expense
- userId (indexed)
- categoryId (ref Category)
- amount (number)
- date (Date)
- note (string optional)
- createdAt, updatedAt
- Index: { userId: 1, date: -1 }

---

# 5) Backend API Contract
Base: /api

### Auth
- POST /auth/register { email, password }
- POST /auth/login { email, password }
- GET /auth/me (Bearer token)

### Categories (Bearer token)
- GET /categories
- POST /categories { name }
- PUT /categories/:id { name }
- DELETE /categories/:id

### Expenses (Bearer token)
- GET /expenses?month=YYYY-MM&page=&limit=&categoryId=
- POST /expenses { amount, date, categoryId, note? }
- PUT /expenses/:id { amount, date, categoryId, note? }
- DELETE /expenses/:id

### Summary (Bearer token)
- GET /summary?month=YYYY-MM

Return proper HTTP codes:
- 200, 201 success
- 400 validation error
- 401 unauthorized
- 404 not found
- 409 conflict (category delete if referenced)
- 500 server error

Backend must include:
- auth middleware that attaches user to request
- centralized error handler middleware returning structured JSON:
  { error: { message, code, details? } }

---

# 6) Frontend Behavior
- Use axios client with baseURL from VITE_API_URL
- Attach token via request interceptor
- Use React Query for all API calls (query + mutations)
- After mutations, invalidate queries properly
- Pages:
  - /login, /register (public)
  - /dashboard, /expenses, /categories (protected)
- Dashboard includes month picker (YYYY-MM input is fine)
- Expenses page includes:
  - month filter
  - category filter dropdown
  - table listing with edit/delete
  - add expense modal
- Categories page includes:
  - list categories
  - add/rename/delete with modal
- Provide simple responsive layout with navbar

---

# 7) Environment + Running Locally
## Root .env.example
- MONGO_URI=
- JWT_SECRET=
- API_PORT=5000
- WEB_PORT=5173

## apps/api/.env.example
- MONGO_URI=
- JWT_SECRET=
- PORT=5000
- CORS_ORIGIN=http://localhost:5173

## apps/web/.env.example
- VITE_API_URL=http://localhost:5000/api

Provide scripts:
- root: npm run dev => runs both api and web concurrently
- api: npm run dev (ts-node-dev or nodemon + ts)
- web: npm run dev

---

# 8) Docker Compose (recommended)
- Add docker-compose.yml at root:
  - mongo service
  - api service
  - web service
Make it optional, but working.

---

# 9) Documentation
## README.md must include
- Overview
- Tech stack
- Setup steps (without Docker and with Docker)
- How to run tests (if you include tests; optional)
- API summary link to docs/API.md

## docs/API.md must include
- endpoint list + request/response examples

## docs/AI_USAGE.md must include
- placeholders for:
  - Prompt:
  - AI Response:
  - What I used:
  - What I changed and why:
Add at least 3 sections (backend, frontend, aggregation summary).

---

# 10) Quality Checklist (Cursor must satisfy)
- Code compiles and runs
- API endpoints work with auth
- UI can login and perform CRUD
- Monthly summary works
- Clean error handling + validation
- Repo structure exactly as requested

---

## Deliverables
1) Create all files with full code.
2) Ensure "npm install" at root installs everything (workspace).
3) Ensure "npm run dev" starts both apps and works end-to-end.
4) Ensure env examples are present.
5) Include minimal seed: after register, auto-create default categories (Food, Travel, Shopping, Bills) unless user already has them.

Now implement the entire repository accordingly.
```
</details>
