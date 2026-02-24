# Expense Tracker (MERN)

Monorepo for a **Personal Expense Tracking App**: backend in `apps/api` (Express + TypeScript + MongoDB Atlas), frontend in `apps/web` (Vite + React + TypeScript).

---

## Live URLs

| App | URL |
|-----|-----|
| **Frontend (Vercel)** | https://expense-tracker-mern-web.vercel.app |
| **Backend (Render)** | https://expense-tracker-api-grka.onrender.com |
| **Backend Health** | https://expense-tracker-api-grka.onrender.com/api/health |

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
