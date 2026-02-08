# 🛰️ Cosmic Watch - Satellite Monitoring System

**A real-time satellite and Near-Earth Object (NEO) monitoring dashboard** that tracks asteroids approaching Earth and provides users with critical astronomical data.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**Cosmic Watch** is a sophisticated satellite monitoring system designed for tracking Near-Earth Objects (NEOs) and providing real-time astronomical data. The application integrates with NASA's NEO API to deliver up-to-date asteroid tracking information with an intuitive, modern interface.

Originally developed as a hackathon project, Cosmic Watch has evolved into a production-ready monitoring platform with:
- Real-time socket-based updates
- Secure user authentication
- Personalized watchlists
- 3D asteroid visualization
- Responsive design
- Mobile-friendly interface

---

## ✨ Features

### 🔐 Authentication & Security
- **Secure Sign-up/Login** - User registration with password hashing (bcryptjs)
- **JWT Tokens** - Stateless authentication with Bearer tokens
- **Protected Routes** - Role-based access control for dashboard features
- **Session Management** - Persistent authentication across sessions

### 🔭 Asteroid Tracking
- **Real-time NEO Feed** - Live streams of Near-Earth Objects approaching Earth
- **NASA Data Integration** - Direct API integration with NASA's NEO database
- **Advanced Search** - Filter asteroids by date range, size, and hazard level
- **Detailed Metrics** - Diameter, velocity, distance, and orbital parameters

### 📌 Watchlist Management
- **Personal Watchlists** - Save and track asteroids of interest
- **Custom Annotations** - Add notes and observations to tracked objects
- **Quick Actions** - Add/remove items with one click
- **Persistent Storage** - All watchlist data saved to MongoDB

### 📊 Dashboard Analytics
- **System Status** - Health monitoring and API status
- **Asteroid Statistics** - Real-time counts and categorization
- **Impact Scenarios** - Orbital mechanics and collision probability calculations
- **Historical Data** - Track asteroid data over time

### 🎨 User Interface
- **Modern Design** - Built with shadcn/ui components and Tailwind CSS
- **3D Visualizations** - Three.js-powered asteroid visualization
- **Responsive Layout** - Seamless experience on desktop, tablet, mobile
- **Dark Theme** - Cyberpunk-inspired aesthetic with neon accents
- **Real-time Updates** - Socket.io for live data streaming

### 💬 Real-time Communication
- **Socket.io Integration** - Bi-directional communication between client and server
- **Live Notifications** - Instant alerts for critical asteroid events
- **Chat System** - Built-in messaging for team collaboration

---

## 🏗️ Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dashboard | Explorer | Inspection | Documentation  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │ HTTP/WebSocket │ Vite Dev Proxy (localhost:8080)
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auth Routes │ NEO Routes │ Watchlist Routes         │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Middleware: Auth | Validation | Error Handling      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Services: NASA API Integration | Socket.io Manager  │   │
│  └──────────────────────────────────────────────────────┘   │
│                    (localhost:5001)                          │
└─────────────────────────────────────────────────────────────┘
          │ Mongoose ODM │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Users | Watchlists | Authenticated Sessions        │   │
│  └──────────────────────────────────────────────────────┘   │
│                    (localhost:27017)                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Authentication** → JWT token stored in localStorage
2. **API Requests** → Bearer token in Authorization header
3. **Real-time Updates** → WebSocket connection via Socket.io
4. **External Data** → NASA NEO API integration
5. **Storage** → MongoDB persistence for users and watchlists

---

## 🛠️ Tech Stack

### Frontend
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18 | UI library |
| **Language** | TypeScript | Type safety |
| **Build Tool** | Vite | Fast dev server & bundling |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **UI Components** | shadcn/ui | Accessible component library |
| **3D Graphics** | Three.js | Asteroid visualization |
| **HTTP Client** | Axios | API requests |
| **Real-time** | Socket.io Client | WebSocket communication |
| **Forms** | react-hook-form | Form state management |
| **Validation** | Zod | Schema validation |
| **Testing** | Vitest | Unit testing |

### Backend
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime |
| **Framework** | Express.js | Web framework |
| **Database** | MongoDB | NoSQL database |
| **Authentication** | JWT + bcryptjs | Secure auth |
| **Real-time** | Socket.io | WebSocket server |
| **External API** | NASA NEO API | Asteroid data source |
| **Validation** | express-validator | Input validation |
| **Middleware** | Helmet, CORS, Compression | Security & optimization |
| **Dev Tool** | Nodemon | Auto-restart on changes |

### DevOps
| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & static serving |

---

## 📁 Project Structure

```
stellar-monitor-desk-1/
│
├── frontend/                          # React application
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   ├── 3d/                   # 3D visualization components
│   │   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── SystemStatusBar.tsx
│   │   ├── pages/                    # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ExplorerPage.tsx
│   │   │   ├── AsteroidInspectionPage.tsx
│   │   │   ├── DocumentationPage.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAsteroidFeed.ts    # Asteroid data fetching
│   │   │   ├── useWatchlist.ts       # Watchlist management
│   │   │   ├── useAlertSettings.ts   # Alert configuration
│   │   │   └── useAsteroidLookup.ts  # Asteroid search
│   │   ├── services/                 # API & external services
│   │   │   ├── auth.ts               # Authentication service
│   │   │   ├── nasa.ts               # NASA API client
│   │   │   └── socket.ts             # Socket.io client
│   │   ├── types/                    # TypeScript type definitions
│   │   │   └── asteroid.ts
│   │   ├── utils/                    # Utility functions
│   │   │   ├── impactScenario.ts     # Collision calculations
│   │   │   └── orbitalPhysics.ts     # Physics calculations
│   │   ├── lib/                      # Library utilities
│   │   │   ├── apiClient.ts          # Axios instance
│   │   │   └── mapBackendAsteroid.ts # Data mapping
│   │   ├── data/                     # Static data
│   │   │   └── mockAsteroids.ts
│   │   ├── App.tsx                   # Root component
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── public/                        # Static assets
│   │   └── textures/                 # 3D textures
│   ├── vite.config.ts                # Vite configuration
│   ├── tsconfig.json                 # TypeScript config
│   ├── tailwind.config.ts            # Tailwind config
│   ├── package.json
│   └── Dockerfile                    # Container configuration
│
├── backend/                           # Express API server
│   ├── src/
│   │   ├── controllers/              # Request handlers
│   │   │   ├── authController.js     # Auth logic
│   │   │   ├── neoController.js      # NEO/Asteroid logic
│   │   │   └── watchlistController.js # Watchlist logic
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── neoRoutes.js
│   │   │   └── watchlistRoutes.js
│   │   ├── models/                   # MongoDB schemas
│   │   │   ├── User.js               # User document
│   │   │   └── Watchlist.js          # Watchlist document
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.js               # JWT verification
│   │   │   ├── error.js              # Error handling
│   │   │   └── validation.js         # Input validation
│   │   ├── services/                 # Business logic
│   │   │   └── nasaService.js        # NASA API integration
│   │   ├── utils/                    # Helper functions
│   │   │   └── database.js           # MongoDB connection
│   │   └── server.js                 # Entry point
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml                 # Frontend compose
├── docker-compose.mongo.yml           # MongoDB compose
├── nginx.conf                         # Nginx configuration
│
├── AI-LOG.md                          # AI assistance documentation
├── README.md                          # This file
└── .gitignore

```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js 18+** - [Install](https://nodejs.org/)
- **npm or Yarn** - Comes with Node.js
- **MongoDB** - Local or Docker
- **Git** - For version control
- **Docker** (optional) - For containerized MongoDB

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd stellar-monitor-desk-1
```

### Step 2: Setup MongoDB

**Option A: Docker (Recommended)**
```bash
docker-compose -f docker-compose.mongo.yml up -d
```

**Option B: Local MongoDB**
```bash
mongod
```

### Step 3: Setup Backend

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env file with your values
# - JWT_SECRET: Your secret key for JWT tokens
# - NASA_API_KEY: Your NASA API key (or use DEMO_KEY)
# - MONGODB_URI: MongoDB connection string (default: mongodb://localhost:27017/cosmic_watch)

# Install dependencies
npm install

# Start development server
npm run dev
# Server will run on http://localhost:5001
```

### Step 4: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will run on http://localhost:8080
```

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

---

## 🎯 Running the Project

### Quick Start (All Services)

```bash
# Terminal 1: MongoDB
docker-compose -f docker-compose.mongo.yml up -d

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

### Individual Commands

**Backend Development**
```bash
cd backend
npm run dev      # Start with auto-reload
npm start        # Start without auto-reload
npm test         # Run tests
```

**Frontend Development**
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests
npm run lint     # Run ESLint
```

### Docker Compose (Full Stack)

```bash
docker-compose up -d
```

This will start:
- Frontend (port 3000)
- Backend (port 5001)
- MongoDB (port 27017)

---

## 📡 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /api/user/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get Current User
```http
GET /api/user/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Asteroid/NEO Endpoints

#### Get NEO Feed
```http
GET /api/feed?start_date=2026-02-01&end_date=2026-02-28
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "2000433",
      "name": "Eros",
      "diameter": { "min": 12.5, "max": 14.2 },
      "distance": "0.1234 AU",
      "velocity": "15.2 km/s",
      "hazardous": false
    },
    ...
  ]
}
```

### Watchlist Endpoints

#### Get Watchlist
```http
GET /api/watchlist
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "success": true,
  "watchlist": [
    {
      "id": "507f1f77bcf86cd799439011",
      "asteroidId": "2000433",
      "asteroidName": "Eros",
      "notes": "Close approach in March",
      "addedAt": "2026-02-08T10:30:00Z"
    },
    ...
  ]
}
```

#### Add to Watchlist
```http
POST /api/watchlist
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "asteroidId": "2000433",
  "asteroidName": "Eros",
  "asteroidData": { /* full asteroid data */ },
  "notes": "Optional notes"
}

Response: 201 Created
{
  "success": true,
  "watchlistItem": { /* created item */ }
}
```

#### Remove from Watchlist
```http
DELETE /api/watchlist/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "success": true,
  "message": "Removed from watchlist"
}
```

---

## 👨‍💻 Development Guide

### Code Style & Standards

- **TypeScript** - Use strict mode (`"strict": true`)
- **ESLint** - Run `npm run lint` before commits
- **Prettier** - Auto-format on save
- **Components** - Functional components with hooks
- **File Names** - PascalCase for components, camelCase for utilities

### Frontend Development Workflow

1. Create component in `src/components/`
2. Define types in `src/types/`
3. Add hooks if state management needed
4. Style with Tailwind CSS classes
5. Export from barrel files
6. Import and use in pages

### Backend Development Workflow

1. Define MongoDB schema in `src/models/`
2. Create route file in `src/routes/`
3. Write controller logic in `src/controllers/`
4. Add middleware as needed in `src/middleware/`
5. Use services for external API calls
6. Add validation middleware

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/cosmic_watch
JWT_SECRET=your-secret-key-here
NASA_API_KEY=your-nasa-api-key
CORS_ORIGIN=http://localhost:8080
```

**Frontend (.env - optional)**
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

### Testing

```bash
# Frontend tests
cd frontend && npm run test:watch

# Backend tests
cd backend && npm test
```

---

## 🐳 Deployment

### Docker Deployment

Build and run containers:
```bash
docker-compose up --build
```

### Production Build

**Frontend**
```bash
cd frontend
npm run build
# Output in dist/
```

**Backend**
```bash
cd backend
NODE_ENV=production npm start
```

### Environment Configuration for Production

Ensure these variables are set:
- `NODE_ENV=production`
- `JWT_SECRET=<strong-random-secret>`
- `NASA_API_KEY=<valid-api-key>`
- `MONGODB_URI=<production-mongodb-uri>`
- `CORS_ORIGIN=<production-domain>`

---

## 🤝 Contributing

### Before Making Changes

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Run linter: `npm run lint`
5. Commit with clear messages: `git commit -m "feat: add new feature"`
6. Push and create a Pull Request

### Commit Message Format

```
type: subject

- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting
- refactor: code restructuring
- test: test additions
- chore: maintenance
```

---

## 📝 Documentation Files

- **[AI-LOG.md](./AI-LOG.md)** - Details on LLM assistance during development
- **[backend/README.md](./backend/README.md)** - Backend-specific documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend-specific documentation

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB: `docker-compose -f docker-compose.mongo.yml up -d`

### Frontend Proxy Error
```
[vite] http proxy error: /api/...
```
**Solution**: Ensure backend is running on port 5001

### Authentication Token Issues
```
401 Unauthorized
```
**Solution**: 
- Clear localStorage
- Log out and log back in
- Check JWT_SECRET matches between sessions

### Port Already in Use
```
Address already in use :::5001
```
**Solution**: 
```bash
# Find process using port
lsof -i :5001

# Kill process
kill -9 <PID>
```

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [NASA NEO API](https://api.nasa.gov/#NeoWS)
- [Socket.io Documentation](https://socket.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Project Team

**Original Hackathon**: Hackathon-COSMIC-WATCH

**Current Development**: Full stack project with separated frontend and backend architecture.

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation

---

## 🔄 Final Notes

This project demonstrates:
- ✅ Full-stack JavaScript development
- ✅ Real-time communication with WebSockets
- ✅ RESTful API design
- ✅ Modern frontend architecture
- ✅ Authentication & security best practices
- ✅ External API integration
- ✅ DevOps & containerization
- ✅ Responsive UI/UX design

**All functionality preserved during folder reorganization. No breaking changes.**

---

*Last Updated: February 8, 2026*
*Project Status: Production Ready* ✅
