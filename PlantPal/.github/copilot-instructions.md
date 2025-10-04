<!-- .github/copilot-instructions.md - guidance for AI coding agents working on PlantPal -->

# Quick instructions for code changes in PlantPal

This repository contains a React + Vite frontend (top-level `src/`) and a minimal Express/Mongo backend in `plantpal-backend/`.

Key facts an AI should know before editing code:

- Architecture: frontend (React, Vite, Tailwind) talks to backend REST API at `http://localhost:5000/api` (see `src/config/api.js`).
- Auth: JWT stored in `localStorage` as `userToken`. Axios is configured in `src/utils/apiAuth.js` to attach `Authorization: Bearer <token>` for protected requests.
- Backend: Express server in `plantpal-backend/index.js` exposes routes under `/api/auth`, `/api/plants`, and `/api/dashboard`. Protected routes use `middleware/auth.js` which expects a Bearer JWT signed with `process.env.JWT_SECRET`.

Developer workflows / commands

- Frontend (inside `PlantPal/`):
  - Install dependencies: `npm install`
  - Run dev server: `npm run dev` (launches Vite and opens browser)
  - Build for production: `npm run build`
  - Lint: `npm run lint`
- Backend (inside `plantpal-backend/`):
  - Install: `npm install`
  - Run in dev: `npm run dev` (uses `nodemon`)
  - Run: `npm start`

Environment notes

- Backend requires environment variables: at minimum `MONGO_URI` and `JWT_SECRET` (loaded with `dotenv` in `plantpal-backend/index.js`). See `plantpal-backend/config/db.js` for DB connection usage.
- Frontend API base URL is `src/config/api.js`. Change it only if backend runs on a different host/port.

Project-specific patterns and gotchas

- Context wrapper: `src/main.jsx` wraps `<App/>` inside `UserProvider` from `src/context/UserContext.jsx`. Many components expect `useUser()` to exist — avoid removing the provider.
- Token lifecycle: `UserContext` decodes token locally (using `jwt-decode`) and then calls backend profile endpoints to populate `user`. When adding new protected endpoints, follow the same pattern: use `apiAuth` or attach `Authorization: Bearer <token>`.
- API clients: Use `axios` directly only for unauthenticated fetches (see `Plantlib.jsx` uses `axios` + `API_URL` when fetching public plant library). Use `apiAuth` for requests requiring authentication to ensure interceptor attaches the token.
- Device / Arduino integration: Backend has endpoints for device polling and commands under `/api/dashboard` (`/data`, `/commands/:deviceId`, `/water/:deviceId`, `/setup-device`). When simulating hardware, POST sensor payloads matching `{ deviceId, moisture, waterAction }`.
- Error handling style: routes return JSON with `{ message: '...' }` and relevant HTTP status codes. Follow this response shape when adding endpoints.

Files to reference when making changes

- Frontend
  - `src/main.jsx` — app entry; ensure `UserProvider` stays.
  - `src/config/api.js` — base API URL.
  - `src/utils/apiAuth.js` — axios instance attaching tokens.
  - `src/context/UserContext.jsx` — login/logout and token validation flows.
  - `src/Pages/Plantlib.jsx` — example of filters, search, and device setup flow.
  - `src/Components/DeviceSetupForm.jsx` — device registration flow (used by Plantlib).
- Backend
  - `plantpal-backend/index.js` — server bootstrap, route mounting order (dotenv -> DB -> middleware -> routes).
  - `plantpal-backend/middleware/auth.js` — JWT verification; sets `req.user`.
  - `plantpal-backend/routes/*.js` — route examples (auth, plants, dashboard).
  - `plantpal-backend/models/*.js` — mongoose schemas for `User`, `Plant`, `Device`.

When proposing code changes

- Keep changes small and local to the relevant layer (frontend vs backend). Update both sides if you change API shapes.
- Run the dev servers (frontend and backend) to verify flows. Typical quick smoke test: start backend (`npm run dev`), start frontend (`npm run dev`), open the app and exercise login/signup and Plant Library list.
- Preserve existing response formats (JSON with `message` on errors) and tokens in `localStorage` to avoid breaking the app.

Examples (use these to guide edits)

- Add an authenticated API call from React:
  - Use `apiAuth.get('/dashboard/devices')` not `axios.get(...)` so token is sent automatically (see `src/utils/apiAuth.js`).
- Register a device (backend sequence):
  - Frontend POST to `${API_URL}/dashboard/setup-device` with `{ plantId, deviceName, deviceId }` and Authorization header.
  - Backend route copies `plant.name` into `Device.plantType` and creates a `Device` document (see `plantpal-backend/routes/dashboard.js`).

If something is unclear or you need environment details (e.g., `MONGO_URI` value, `JWT_SECRET`), ask the maintainer before changing authentication or DB code.

— End of file
