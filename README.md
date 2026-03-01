# gamification-demo-ui

Frontend: minimal Next.js demo for the gamification-core API (quest list, report event, my progress).

Part of the Gamification & Mini Exchange ecosystem. See `ARCHITECTURE_AND_PROJECTS.md` in the workspace root for full architecture and repo map.

## Dev setup (Docker)

- Ensure gamification-core API is running (e.g. `docker compose up -d` in gamification-core).
- Copy `.env.example` to `.env` and set `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`). From another machine use the API host (e.g. `http://host.docker.internal:8000` if UI runs in Docker and API on host).
- Run: `docker compose up -d`. App: http://localhost:3000.
- Code is mounted; change files and save for hot reload (no rebuild).
