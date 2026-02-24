# API Reference

Base path: `/api`. All protected endpoints require header: `Authorization: Bearer <token>`.

---

## Auth

### POST /auth/register

Register a new user. Creates default categories (Food, Travel, Shopping, Bills) for the user.

**Request**

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response** `201`

```json
{
  "user": { "id": "...", "email": "user@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:** `400` — validation or "Email already registered".

---

### POST /auth/login

**Request**

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response** `200`

```json
{
  "user": { "id": "...", "email": "user@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:** `401` — "Invalid email or password".

---

### GET /auth/me

Returns current user. Requires Bearer token.

**Response** `200`

```json
{
  "user": { "id": "...", "email": "user@example.com" }
}
```

**Errors:** `401` — missing/invalid token.

---

## Categories (all require Bearer token)

### GET /categories

**Response** `200`

```json
[
  { "_id": "...", "userId": "...", "name": "Food", "createdAt": "..." },
  { "_id": "...", "userId": "...", "name": "Travel", "createdAt": "..." }
]
```

---

### POST /categories

**Request**

```json
{ "name": "Entertainment" }
```

**Response** `201`

```json
{
  "_id": "...",
  "userId": "...",
  "name": "Entertainment",
  "createdAt": "..."
}
```

**Errors:** `400` — validation or "Category with this name already exists".

---

### PUT /categories/:id

**Request**

```json
{ "name": "Entertainment Updated" }
```

**Response** `200` — full category object.

**Errors:** `400` — duplicate name; `404` — category not found.

---

### DELETE /categories/:id

**Response** `204` (no body).

**Errors:** `404` — not found; `409` — category is referenced by expenses (message describes count).

---

## Expenses (all require Bearer token)

### GET /expenses

Query params (all optional):

- `month` — `YYYY-MM`
- `page` — default 1
- `limit` — default 20, max 100
- `categoryId` — filter by category

Results sorted by date descending.

**Response** `200`

```json
{
  "expenses": [
    {
      "_id": "...",
      "userId": "...",
      "categoryId": { "_id": "...", "name": "Food" },
      "amount": 150.5,
      "date": "2024-01-15T00:00:00.000Z",
      "note": "Lunch",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

---

### POST /expenses

**Request**

```json
{
  "amount": 99.99,
  "date": "2024-01-15",
  "categoryId": "...",
  "note": "Optional note"
}
```

**Response** `201` — full expense object.

**Errors:** `400` — validation; `404` — category not found.

---

### PUT /expenses/:id

**Request** (all fields optional): `amount`, `date`, `categoryId`, `note`.

**Response** `200` — full expense object.

**Errors:** `400` — validation; `404` — expense or category not found.

---

### DELETE /expenses/:id

**Response** `204`.

**Errors:** `404` — not found.

---

## Summary (Bearer token)

### GET /summary?month=YYYY-MM

**Response** `200`

```json
{
  "totalSpend": 1250.5,
  "count": 12,
  "byCategory": [
    { "categoryId": "...", "categoryName": "Food", "total": 600 },
    { "categoryId": "...", "categoryName": "Travel", "total": 350.5 }
  ]
}
```

**Errors:** `400` — missing or invalid `month`.

---

## Error format

All errors return JSON:

```json
{
  "error": {
    "message": "Human-readable message",
    "code": "BAD_REQUEST",
    "details": { ... }
  }
}
```

Common codes: `BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`.

HTTP status: `400`, `401`, `404`, `409`, `500`.
