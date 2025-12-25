Production checklist and recommended changes

1. Environment

- Create a `.env` file in the project root (do NOT commit) with values from `.env.example`
  - `PORT`, `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `CLOUDINARY_*`, `NODE_ENV=production`
- For frontend, set `VITE_API_URL` if backend is on a different domain.

2. Cookies & Auth

- JWT cookie: For **same-origin** deployments we recommend `SameSite: "lax"` and `secure: true` (requires HTTPS).
- For cross-origin deployments (frontend and backend on different domains), use `SameSite: "none"` and `secure: true`.
- Ensure HTTPS is used in production (browsers block SameSite=none without Secure).

3. CORS & Socket

- `FRONTEND_URL` is used for CORS and socket origins. Make sure it matches deployed frontend domain.

4. Logging & Security

- Added Helmet, Compression, and Morgan for security and logging.
- Consider adding `express-rate-limit` and input validation (e.g., `celebrate`/`joi`) for extra protection.

5. Build & Start

- Use `npm run build` from repo root (or `npm run start:prod`) to build frontend and start backend.
- If deploying to Render (single service): set the service start command to `npm run start:prod` and set `FRONTEND_URL`/`BACKEND_URL` environment variables in service settings.
- If deploying frontend and backend as separate services, ensure `FRONTEND_URL` points to the frontend service and `BACKEND_URL` to the backend service (and that sockets are allowed to upgrade).

6. Monitoring

- Add error reporting and monitoring (Sentry, LogDNA, etc.)

7. Tests

- Add integration tests for auth/session restoration and socket reconnection to prevent regressions.

If you'd like, I can:

- Add `express-rate-limit` quickly and wire it in, or
- Add a basic health/readiness endpoint and a small smoke-test script, or
- Add automated integration test that checks auth + socket reconnect across a reload.
