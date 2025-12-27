# Keystroke Logger

A minimal keystroke-logging demo app (for learning & demo purposes).

## Demo / Live link
Live demo: https://keystroke-logger-demonstration.vercel.app/

## Screenshots
Include a screenshot (e.g., `screenshots/logger.png`) showing the app UI.

## Tech stack
- Frontend: Vite + React, Chart.js
- Backend: Node.js + Express, Socket.IO

## Quick start
Prerequisites: Node 18+, npm

1. Install dependencies

   npm install

2. Start dev (server + frontend)

   npm run dev

3. Open UI

   http://localhost:5173/

## Test utilities
- Post a test keystroke and read the count:

  node tools/test_post.js

- Socket test:

  node tools/socket_test.js

## Environment variables
- Root: `.env` or `.env.example`
  - PORT (default 5000)
  - ALLOW_PERSISTENCE=false
- Frontend: `keystroke-ui/.env` (or `.env.example`)
  - VITE_API_URL=http://localhost:5000

## Demo credentials
- username: `admin`
- password: `password123`

## Privacy & Security
- This is a demo project. Keystroke data is stored in-memory by default.
- The server requires an `X-Consent: true` header for UI posts.

## Deployment suggestions
- Frontend: Vercel (connect the repo, set `VITE_API_URL` to your backend URL). A sample `vercel.json` is included in `keystroke-ui/`.
- Backend: Render (connect repo and use `npm run start`) — a sample `render.yaml` manifest is included for convenience. Alternatively, use Railway which offers a straightforward Node deploy.

### Vercel (frontend) — quick steps
1. Sign in to Vercel and choose "Import Project" → select your GitHub repo.
2. For the project root choose the repository root (Vercel will detect `keystroke-ui`).
3. Set the build command to `npm run build` and the output directory to `keystroke-ui/dist` (or leave defaults if detected).
4. Add Environment Variable `VITE_API_URL` with the backend URL (e.g. `https://your-backend.onrender.com`).
5. Deploy. After deployment, copy the Vercel site URL and place it in the top of the README under "Demo / Live link".

### Render (backend + optional static site) — quick steps
1. Sign in to Render and import the repo.
2. Create a **Web Service** for `keystroke-server`:
   - Environment: Node
   - Build Command: (none required) or `npm ci`
   - Start Command: `npm run start`
   - Env Vars: set `PORT`, and `ALLOW_PERSISTENCE` as needed.
3. Create a **Static Site** (optional) for `keystroke-ui`:
   - Build Command: `cd keystroke-ui && npm ci && npm run build`
   - Publish Directory: `keystroke-ui/dist`
   - Set `VITE_API_URL` to the deployed backend URL.
4. After Render deploys, copy the service URL and add it to the README as the Live Demo link.

### Railway — quick steps
1. Create a Railway project and connect your GitHub repo.
2. Add two services: one Node service for the backend (start command `npm run start`) and one static build for the frontend (build command `cd keystroke-ui && npm run build`).
3. Add `VITE_API_URL` to the frontend service environment variables pointing to the backend service URL.

---

## Live demo link
Add your live demo URL here after deployment (e.g. https://your-app.onrender.com or https://your-frontend.vercel.app)

If you'd like, I can help connect the GitHub repo to Vercel and Render step-by-step and update the README with the deployed URLs once you authorize or provide the service URLs.

## CI
A GitHub Actions workflow is included at `.github/workflows/ci.yml` that builds the frontend and installs server dependencies.

## Contributing
Open a PR with changes; add tests if you add functionality.

---
