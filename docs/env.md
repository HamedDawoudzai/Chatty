# Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| REDIS_URL | Yes | - | Redis connection string |
| SECRET_KEY | Yes | - | JWT signing secret (use `openssl rand -hex 32`) |
| ACCESS_TOKEN_EXPIRE_MINUTES | No | 30 | JWT expiry |
| APP_ENV | No | development | `development` or `production` |
| DEBUG | No | true | Enable debug mode |
| ALLOWED_ORIGINS | No | http://localhost:5173 | CORS origins (comma-separated) |
| STORAGE_BACKEND | No | local | `local` or `s3` |
| AWS_ACCESS_KEY_ID | No | - | S3 access key |
| AWS_SECRET_ACCESS_KEY | No | - | S3 secret |
| AWS_BUCKET_NAME | No | chatty-uploads | S3 bucket |
| SENTRY_DSN | No | - | Sentry error tracking DSN |
| MAX_FILE_SIZE_MB | No | 10 | Max upload size |
