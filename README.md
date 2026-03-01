# Gamification Demo UI

Minimal **Next.js** demo for the [gamification-core](https://github.com/meetrakib/gamification-core) API. Use it to list quests, report events, view user progress, and claim rewards — no authentication; you supply a `user_id` in the UI.

Part of the [Gamification](https://github.com/meetrakib/gamification-core) & [Mini Exchange](https://github.com/meetrakib/mini-derivatives-exchange) ecosystem. The backend lives in **gamification-core** (separate repo).

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Docker Setup](#docker-setup)
- [Local Development](#local-development)
- [Usage](#usage)
- [Tech Stack](#tech-stack)

---

## Features

- **Quest list**: Fetches and displays active quests from `GET /api/v1/quests` (name, description, rules, reward).
- **Report event**: Form to send `POST /api/v1/events` with:
  - **User ID** (e.g. `user-1`)
  - **Event type** (e.g. `trade`, `signup`)
  - **Payload** (JSON, e.g. `{"volume_usd": 100}`)
- **My progress**: Enter a user ID and load progress from `GET /api/v1/users/{user_id}/progress`. Shows state (not_started, in_progress, completed, reward_claimed) and progress payload.
- **Claim reward**: For progress in `completed` state, a “Claim reward” button calls `POST /api/v1/users/{user_id}/quests/{quest_id}/claim` (idempotent).

No login or API key; the demo assumes the core API is open for dev. For production, the multi-tenant **quest-saas-api** and **quest-saas-web** provide auth and tenant-scoped dashboards.

---

## Prerequisites

- **gamification-core** API must be running (e.g. `docker compose up -d` in the gamification-core repo).
- API base URL must be reachable from the browser (or from the Docker host if the UI runs in Docker). Use `http://host.docker.internal:8000` if the UI is in Docker and the API is on the host.

---

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of the gamification-core API (no trailing slash). | `http://localhost:8000` |

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_API_URL` if your API runs elsewhere (e.g. different host/port or Docker host).

---

## Docker Setup

1. Ensure **gamification-core** is running (e.g. `http://localhost:8000`).
2. Clone and enter the repo:
   ```bash
   cd gamification-demo-ui
   ```
3. Copy env:
   ```bash
   cp .env.example .env
   ```
4. If the UI runs in Docker and the API on the host, set in `.env`:
   ```bash
   NEXT_PUBLIC_API_URL=http://host.docker.internal:8000
   ```
5. Start the app:
   ```bash
   docker compose up -d
   ```
6. Open **http://localhost:3000**. Code is mounted; change files and save for hot reload.
7. Stop:
   ```bash
   docker compose down
   ```

---

## Local Development

- Node.js 18+ and npm (or yarn/pnpm).

```bash
npm install
cp .env.example .env   # set NEXT_PUBLIC_API_URL if needed
npm run dev
```

App: **http://localhost:3000**.

---

## Usage

1. Open the app and confirm the **API** URL shown at the top is correct.
2. **Quests**: The page loads active quests on mount. If none appear, start gamification-core and refresh.
3. **Report event**: Enter user ID, event type (e.g. `trade`), and a JSON payload (e.g. `{"volume_usd": 100}`). Click “Send event”. Progress for that user is updated for all matching quests.
4. **My progress**: Enter the same user ID and click “Load progress”. You’ll see each quest’s state and progress payload. When a quest is **completed**, use “Claim reward” to mark it as reward_claimed.

---

## Tech Stack

- **Next.js** (App Router)
- **React** (client components for forms and fetch)
- No auth in this demo; backend is gamification-core only.

For full architecture and repo map, see `ARCHITECTURE_AND_PROJECTS.md` in the workspace root (if present) or the main ecosystem repo.
