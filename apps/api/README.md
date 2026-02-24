# Expense Tracker API

Express + TypeScript backend for the expense tracker app.

## Run locally

```bash
npm install
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET
npm run dev
```

Health check: `curl http://localhost:5001/api/health`

---

## Deploy on Render

1. **New Web Service** → connect repo → set:

   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`

2. **Environment variables** (Required):

   - `MONGO_URI` – MongoDB Atlas connection string
   - `JWT_SECRET` – secret for signing JWTs
   - `CORS_ORIGIN` – allowed origin(s), e.g. `https://your-frontend.vercel.app` or comma-separated: `http://localhost:5173,https://myapp.vercel.app`  
     (Render sets `PORT` automatically.)

3. **After deploy:** open `https://your-service.onrender.com/api/health`  
   Expected: `{ "status": "ok", "db": "connected" }`
