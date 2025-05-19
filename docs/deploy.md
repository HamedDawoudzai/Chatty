# Deployment Guide

## Railway

1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Railway auto-detects Dockerfile and deploys

## Docker Compose (VPS)

```bash
cp .env.example .env.prod
# Edit .env.prod with production values
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables

See [env.md](env.md) for all required variables.
