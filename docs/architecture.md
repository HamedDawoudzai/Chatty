# Architecture

```
┌─────────────┐    HTTP/WS    ┌──────────────┐    SQL    ┌──────────┐
│   React SPA │ ────────────► │  FastAPI     │ ────────► │ Postgres │
│   (Vite)    │               │  Backend     │           └──────────┘
└─────────────┘               │              │    Cache  ┌──────────┐
                               │              │ ────────► │  Redis   │
                               └──────────────┘           └──────────┘
```

## Components

- **Frontend**: React 18 + TypeScript, Vite bundler, Tailwind CSS
- **Backend**: FastAPI with async WebSocket support, SQLAlchemy ORM
- **Database**: PostgreSQL with Alembic migrations
- **Cache/PubSub**: Redis for session cache and real-time notifications
- **Auth**: JWT access tokens with bcrypt password hashing
- **Storage**: Local filesystem or S3-compatible object storage
