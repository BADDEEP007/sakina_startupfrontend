# Google Auth & Database Flow — Documentation

A plain-English walkthrough of every function involved in signing a user in
with Google and saving them to Neon PostgreSQL.

---

## Table of Contents

1. [Big Picture Flow](#1-big-picture-flow)
2. [Environment Variables](#2-environment-variables)
3. [Backend](#3-backend)
   - [db.ts — Database Pool](#31-configdbts--database-pool)
   - [userModel.ts — Database Queries](#32-modelsusermodelts--database-queries)
   - [verifyGoogleToken.ts — Token Verification](#33-utilsverifygoogletokents--token-verification)
   - [authController.ts — Request Handler](#34-controllersauthcontrollerts--request-handler)
   - [authRoutes.ts — Route Definition](#35-routesauthroutests--route-definition)
   - [errorHandler.ts — Error Middleware](#36-middlewareserrorhandlerts--error-middleware)
   - [validateBody.ts — Input Guard](#37-middlewaresvalidatebodyts--input-guard)
4. [Frontend](#4-frontend)
   - [AuthContext.tsx — Global Auth State](#41-contextsauthcontexttsx--global-auth-state)
   - [useGoogleAuth.ts — Google Sign-In Hook](#42-hooksusegoogleauthts--google-sign-in-hook)
5. [Data Shapes](#5-data-shapes)
6. [Error Reference](#6-error-reference)

---

## 1. Big Picture Flow

```
User clicks "Continue with Google"
        │
        ▼
[Frontend] useGoogleAuth.signIn()
  └─ Initialises Google Identity Services (GSI)
  └─ Opens Google One-Tap / popup
        │
        ▼ Google returns a signed ID token (JWT)
        │
[Frontend] handleCredentialResponse(credential)
  └─ POST /auth/google  { token: "<id_token>" }
        │
        ▼
[Backend] authController.googleAuth()
  ├─ 1. Validates token field exists in body
  ├─ 2. verifyGoogleToken(token)  ← calls Google's servers
  │       └─ returns { sub, email, name, picture }
  ├─ 3. findUserByProviderId(sub)
  │       └─ if found → return existing user
  ├─ 4. findUserByEmail(email)    ← fallback lookup
  │       └─ if found → return existing user
  └─ 5. createUser(...)           ← only if brand new
          └─ INSERT INTO users ... RETURNING *
        │
        ▼
[Backend] responds { success: true, user: { ...row } }
        │
        ▼
[Frontend] handleCredentialResponse continues
  ├─ Maps DB row → frontend User shape
  ├─ login(user)  ← updates React context
  ├─ localStorage.setItem("handmade_auth_v1", ...)
  └─ toast "Welcome back, [name]!"
        │
        ▼
Navbar re-renders → shows avatar + profile dropdown
```

---

## 2. Environment Variables

| Variable | Where used | Purpose |
|---|---|---|
| `DATABASE_URL` | `server/config/db.ts` | Neon PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | `server/utils/verifyGoogleToken.ts` | Server-side token audience check |
| `VITE_GOOGLE_CLIENT_ID` | `client/src/hooks/useGoogleAuth.ts` | Passed to GSI `initialize()` |
| `VITE_API_URL` | `client/src/hooks/useGoogleAuth.ts` | Base URL for API calls (blank in dev — Vite proxy handles it) |

---

## 3. Backend

### 3.1 `server/config/db.ts` — Database Pool

```
File: server/config/db.ts
Exports: pool (default)
```

#### `pool` (pg.Pool instance)

Creates **one** shared PostgreSQL connection pool for the entire Node process.

| Setting | Value | Why |
|---|---|---|
| `connectionString` | `process.env.DATABASE_URL` | Neon connection string from env |
| `ssl.rejectUnauthorized` | `false` | Accepts Neon's self-signed cert |
| `max` | `10` | Max simultaneous open connections |
| `idleTimeoutMillis` | `30 000` | Releases idle connections after 30 s |
| `connectionTimeoutMillis` | `5 000` | Fails fast if DB is unreachable |

**Why a pool and not a single client?**
Each HTTP request needs a DB connection. Creating a new connection per request
takes ~100 ms and will exhaust Neon's connection limit under any real load.
The pool keeps connections warm and reuses them.

**Error listener**
```ts
pool.on("error", (err) => console.error("[DB] Unexpected pool error:", err.message));
```
Logs unexpected connection drops without crashing the server.

---

### 3.2 `server/models/userModel.ts` — Database Queries

```
File: server/models/userModel.ts
Exports: initUsersTable, findUserByEmail, findUserByProviderId, createUser
```

All SQL lives here. Controllers never write raw queries.

---

#### `initUsersTable(): Promise<void>`

Runs `CREATE TABLE IF NOT EXISTS users (...)` at server startup.

```sql
CREATE TABLE IF NOT EXISTS users (
  id             UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT      UNIQUE NOT NULL,
  name           TEXT,
  display_name   TEXT,
  profile_image  TEXT,
  provider       TEXT      NOT NULL DEFAULT 'google',
  provider_id    TEXT      UNIQUE,
  is_seller      BOOLEAN   NOT NULL DEFAULT false,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);
```

- `gen_random_uuid()` — PostgreSQL generates a UUID automatically; no app code needed.
- `UNIQUE` on `email` and `provider_id` — the database itself prevents duplicates even if two requests race.
- Safe to call on every deploy because of `IF NOT EXISTS`.

---

#### `findUserByEmail(email: string): Promise<UserRow | null>`

```sql
SELECT * FROM users WHERE email = $1 LIMIT 1
```

- Used as a **fallback** when `findUserByProviderId` returns nothing.
- Handles the edge case where a user signed up by email before OAuth existed.
- Returns `null` (not an error) when no row is found.

---

#### `findUserByProviderId(providerId: string): Promise<UserRow | null>`

```sql
SELECT * FROM users WHERE provider_id = $1 LIMIT 1
```

- `provider_id` is Google's `sub` field — a permanent, unique numeric string per Google account.
- This is the **primary lookup** because it is more specific than email (a user can change their email but their `sub` never changes).
- Returns `null` when no row is found.

---

#### `createUser(data: CreateUserInput): Promise<UserRow>`

```sql
INSERT INTO users (email, name, display_name, profile_image, provider, provider_id)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (provider_id) DO NOTHING
RETURNING *
```

- `ON CONFLICT (provider_id) DO NOTHING` — if two simultaneous first-logins race, only one INSERT wins; the other is silently ignored.
- If `RETURNING *` comes back empty (conflict fired), the function calls `findUserByProviderId` to fetch and return the existing row.
- Throws only if the row genuinely cannot be found after the conflict — which should never happen in practice.

---

### 3.3 `server/utils/verifyGoogleToken.ts` — Token Verification

```
File: server/utils/verifyGoogleToken.ts
Exports: verifyGoogleToken, GooglePayload
```

#### `verifyGoogleToken(idToken: string): Promise<GooglePayload>`

Calls Google's servers to cryptographically verify the ID token the frontend sent.

**Steps inside the function:**

1. Calls `client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID })`.
   - Google checks the token's signature, expiry, and that it was issued for **your** client ID.
   - If any check fails, `verifyIdToken` throws — the function does not catch this; it propagates to the controller.

2. Calls `ticket.getPayload()` to extract the decoded JWT claims.

3. Validates that `sub` (Google user ID) and `email` are present.

4. Returns a clean `GooglePayload` object:

```ts
{
  sub:     "1234567890",          // permanent Google user ID
  email:   "user@gmail.com",
  name:    "Jane Doe",
  picture: "https://lh3.googleusercontent.com/..."
}
```

**Why verify server-side?**
The frontend receives a JWT from Google. JWTs can be decoded by anyone — but only
Google can produce a valid signature. Verifying on the server ensures the token
was not forged or tampered with.

**`OAuth2Client` singleton**
```ts
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
```
Created once at module load, reused for every request. Creating a new client per
request is wasteful and unnecessary.

---

### 3.4 `server/controllers/authController.ts` — Request Handler

```
File: server/controllers/authController.ts
Exports: googleAuth
```

#### `googleAuth(req, res, next): Promise<void>`

Handles `POST /auth/google`. Orchestrates the full sign-in flow.

**Step-by-step:**

```
Step 1 — Validate input
  Read req.body.token
  If missing or empty → 400 Bad Request

Step 2 — Verify token
  Call verifyGoogleToken(token)
  If throws → 401 Unauthorized
  Extract: sub, email, name, picture

Step 3 — Look up existing user
  findUserByProviderId(sub)   ← fastest, most specific
  ?? findUserByEmail(email)   ← fallback for pre-OAuth accounts

Step 4 — Create if new
  If no user found:
    createUser({ email, name, display_name, profile_image, provider, provider_id })

Step 5 — Respond
  200 OK  { success: true, user: { ...row } }
```

**Why check `provider_id` before `email`?**
A user could have multiple Google accounts sharing the same email (rare but
possible with Google Workspace). `provider_id` (`sub`) is always unique per
Google account, so it is the more reliable key.

**Error forwarding**
DB errors are passed to `next(err)` so the centralised `errorHandler` middleware
handles them consistently without duplicating error logic.

---

### 3.5 `server/routes/authRoutes.ts` — Route Definition

```
File: server/routes/authRoutes.ts
Exports: router (default)
```

Registers one route:

```
POST /auth/google  →  googleAuth controller
```

Mounted in `server/index.ts` as:
```ts
app.use("/auth", authRoutes);
```

So the full path is `POST /auth/google`.

---

### 3.6 `server/middlewares/errorHandler.ts` — Error Middleware

```
File: server/middlewares/errorHandler.ts
Exports: errorHandler
```

#### `errorHandler(err, req, res, next): void`

Express's 4-argument error middleware. Must be registered **last** in `server/index.ts`.

**What it does:**

1. Converts `err` to an `Error` instance if it isn't one already.
2. Logs the full message + stack trace to the server console (never to the client).
3. Classifies the error:
   - Contains `"duplicate key"`, `"violates"`, or `"connection"` → **409 Conflict**
   - Anything else → **500 Internal Server Error**
4. Returns a safe JSON response:
   ```json
   { "success": false, "error": "A database conflict occurred. Please try again." }
   ```

Raw PostgreSQL error messages (which can contain table names, column names, and
query fragments) are never sent to the client.

---

### 3.7 `server/middlewares/validateBody.ts` — Input Guard

```
File: server/middlewares/validateBody.ts
Exports: validateBody
```

#### `validateBody(requiredFields: string[])`

A **middleware factory** — call it with a list of field names and it returns an
Express middleware that rejects requests missing any of those fields.

```ts
// Usage example
router.post("/google", validateBody(["token"]), googleAuth);
```

If `req.body.token` is `undefined`, `null`, or `""`:
```json
{ "success": false, "error": "Missing required field(s): token" }
```
→ 400 Bad Request. The controller never runs.

---

## 4. Frontend

### 4.1 `client/src/contexts/AuthContext.tsx` — Global Auth State

```
File: client/src/contexts/AuthContext.tsx
Exports: AuthProvider, useAuth, User (type)
```

Provides auth state to the entire React tree via Context + `useReducer`.

---

#### `loadUser(): User | null`

Reads `localStorage.getItem("handmade_auth_v1")` and parses the JSON.
Returns `null` if the key is missing or the JSON is corrupt.
Called once on app startup to restore the previous session.

---

#### `saveUser(user: User | null): void`

Writes the user object to `localStorage` as JSON, or removes the key on logout.
Called automatically whenever `state.user` changes (via `useEffect`).

---

#### `reducer(state, action): AuthState`

Pure function — no side effects. Handles five action types:

| Action | What it does |
|---|---|
| `HYDRATE` | Sets user from localStorage on first mount, sets `isLoading: false` |
| `LOGIN` | Replaces `state.user` with the new user object |
| `LOGOUT` | Sets `state.user` to `null` |
| `SET_SELLER` | Flips `state.user.isSeller` to `true` |
| `UPDATE_USER` | Merges a partial update into the current user |

---

#### `AuthProvider` (component)

Wraps the app. Responsibilities:

1. **Hydration** — on mount, reads localStorage and dispatches `HYDRATE`.
   Renders children with `visibility: hidden` until hydration completes
   (typically < 1 ms) to prevent the navbar flickering between logged-out
   and logged-in states.

2. **Persistence** — `useEffect` watches `state.user` and calls `saveUser`
   on every change.

3. **Logout cleanup** — calls `window.google.accounts.id.disableAutoSelect()`
   so Google's One-Tap prompt doesn't immediately re-sign the user in after
   they log out.

---

#### `useAuth(): AuthContextValue`

The hook every component uses to read or update auth state.

```ts
const { user, isLoggedIn, isSeller, isLoading, login, logout } = useAuth();
```

| Property | Type | Description |
|---|---|---|
| `user` | `User \| null` | The logged-in user, or `null` |
| `isLoggedIn` | `boolean` | `true` when `user !== null` |
| `isSeller` | `boolean` | `true` when `user.isSeller === true` |
| `isLoading` | `boolean` | `true` only during the initial localStorage read |
| `login(user)` | function | Sets the user in state + localStorage |
| `logout()` | function | Clears state + localStorage + Google auto-select |
| `markAsSeller()` | function | Flips `isSeller` to `true` |
| `updateUser(partial)` | function | Merges partial fields into current user |

---

### 4.2 `client/src/hooks/useGoogleAuth.ts` — Google Sign-In Hook

```
File: client/src/hooks/useGoogleAuth.ts
Exports: useGoogleAuth
```

Owns the entire Google → backend → auth-state pipeline.
Returns `{ signIn, isLoading, error }` — the Login page just calls `signIn()`.

---

#### `signIn(): void`

Called when the user clicks "Continue with Google".

1. Checks `VITE_GOOGLE_CLIENT_ID` is set — shows an error toast if not.
2. Checks `window.google.accounts.id` exists — shows an error toast if the
   GSI script hasn't loaded yet.
3. Calls `window.google.accounts.id.initialize({ client_id, callback })` —
   registers `handleCredentialResponse` as the callback.
4. Calls `window.google.accounts.id.prompt()` — shows the One-Tap UI.
   If One-Tap is suppressed (user dismissed it too many times), logs a
   console info message; the user can click the button again.

---

#### `handleCredentialResponse(credential: string): Promise<void>`

The callback Google calls after the user selects their account.
`credential` is a signed JWT (the Google ID token).

**Steps:**

1. Sets `isLoading = true`, clears any previous error.

2. **POST `/auth/google`** with `{ token: credential }`.
   - Uses `fetch` with `Content-Type: application/json`.
   - In development, Vite's proxy forwards this to `http://localhost:3001`.

3. Parses the JSON response. If `res.ok` is false or `data.success` is false,
   throws with the server's error message.

4. **Maps** the backend `UserRow` shape to the frontend `User` shape:
   ```
   data.user.id            → user.id
   data.user.name          → user.name  (falls back to email prefix)
   data.user.email         → user.email
   data.user.profile_image → user.avatar
   data.user.is_seller     → user.isSeller
   ```

5. Calls `login(user)` from `useAuth()` — updates React context and
   writes to localStorage in one step.

6. Shows a success toast: `"Welcome back, [name]! 🎉"`

7. On any error: sets `error` state (shown as a red banner in the UI)
   and shows an error toast.

8. Always sets `isLoading = false` in the `finally` block.

---

## 5. Data Shapes

### PostgreSQL `users` table

```
id             UUID        — auto-generated, primary key
email          TEXT        — unique, required
name           TEXT        — display name from Google
display_name   TEXT        — same as name on first login
profile_image  TEXT        — Google profile picture URL
provider       TEXT        — always "google" for OAuth users
provider_id    TEXT        — Google's "sub" field, unique per account
is_seller      BOOLEAN     — false by default
created_at     TIMESTAMP   — set automatically by PostgreSQL
```

### Backend response `{ success: true, user }`

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane@gmail.com",
    "name": "Jane Doe",
    "display_name": "Jane Doe",
    "profile_image": "https://lh3.googleusercontent.com/...",
    "provider": "google",
    "provider_id": "1234567890",
    "is_seller": false,
    "created_at": "2025-04-16T10:00:00.000Z"
  }
}
```

### Frontend `User` object (stored in context + localStorage)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Jane Doe",
  "email": "jane@gmail.com",
  "avatar": "https://lh3.googleusercontent.com/...",
  "isSeller": false
}
```

---

## 6. Error Reference

| Scenario | HTTP status | Client message |
|---|---|---|
| `token` field missing from body | 400 | `"Missing or invalid token in request body."` |
| Token is expired or forged | 401 | `"Invalid or expired Google token."` |
| Duplicate key / constraint violation | 409 | `"A database conflict occurred. Please try again."` |
| DB connection failure | 500 | `"An unexpected server error occurred."` |
| `VITE_GOOGLE_CLIENT_ID` not set | — (frontend) | Toast: `"Google Client ID is not configured"` |
| GSI script not loaded | — (frontend) | Toast: `"Google Sign-In script has not loaded yet"` |
| Backend returns `success: false` | — (frontend) | Toast with server's error message |
