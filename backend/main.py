from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.logging import setup_logging
from backend.app.api.v1 import auth, users, rooms, messages, ws, reactions
from backend.app.api.v1 import files, notifications, metrics, health as health_router
from backend.app.middleware.rate_limit import RateLimitMiddleware
from backend.app.middleware.request_id import RequestIDMiddleware

setup_logging(debug=settings.DEBUG, json_logs=settings.APP_ENV == "production")

app = FastAPI(
    title="Chatty API",
    version="1.0.0",
    description="Real-time chat API",
    docs_url="/docs" if settings.DEBUG else None,
)

if settings.SENTRY_DSN:
    import sentry_sdk
    sentry_sdk.init(dsn=settings.SENTRY_DSN, traces_sample_rate=0.1)

app.add_middleware(RequestIDMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

for router in [auth.router, users.router, rooms.router, messages.router,
               ws.router, reactions.router, files.router,
               notifications.router, health_router.router]:
    app.include_router(router, prefix="/api/v1")
