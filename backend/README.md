# Cosmic Watch Backend

Backend from [Hackathon-COSMIC-WATCH](https://github.com/ankitagarwal546/Hackathon-COSMIC-WATCH). Run this so the frontend can use real auth, NEO feed, and watchlist.

## Setup

1. **MongoDB** – Use Docker (recommended) or run locally:
   - **Docker Compose** (from project root):
     ```bash
     docker-compose -f docker-compose.mongo.yml up -d
     ```
   - Or single container: `docker run -d -p 27017:27017 --name cosmic-mongo mongo:7`

2. **Env**
   ```bash
   cp .env.example .env
   # Edit .env: set JWT_SECRET, NASA_API_KEY (or keep DEMO_KEY), MONGODB_URI if needed.
   ```

3. **Install & run**
   ```bash
   npm install
   npm run dev
   ```
   Server: `http://localhost:5001`. Frontend (Vite) proxies `/api` to this port in dev.

## API

- `POST /api/user/signup` – register (name, email, password)
- `POST /api/user/login` – login (email, password)
- `GET /api/user/me` – current user (Bearer token)
- `GET /api/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` – NEO feed (Bearer token)
- `GET /api/watchlist` – watchlist (Bearer token)
- `POST /api/watchlist` – add (asteroidId, asteroidName, asteroidData, notes)
- `DELETE /api/watchlist/:id` – remove by watchlist item id
