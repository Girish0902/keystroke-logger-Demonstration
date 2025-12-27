# Keystroke Logger

A minimal keystroke-logging demo app (for learning & demo purposes).

## Demo / Live link
Add your live demo URL here after deployment (e.g. https://your-app.example.com)

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
- Frontend: Vercel (connect the repo, set `VITE_API_URL` to your backend URL)
- Backend: Render/Railway (set env vars and start command `npm run start`)

## CI
A GitHub Actions workflow is included at `.github/workflows/ci.yml` that builds the frontend and installs server dependencies.

## Contributing
Open a PR with changes; add tests if you add functionality.

---
