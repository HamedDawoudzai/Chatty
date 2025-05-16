# Local Development Setup

## Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose

## Quick Start

```bash
# 1. Start infrastructure
docker-compose up -d postgres redis

# 2. Backend setup
pip install poetry
poetry install
cp .env.example .env
alembic upgrade head
uvicorn backend.main:app --reload

# 3. Frontend setup (separate terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
