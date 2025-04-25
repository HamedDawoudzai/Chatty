import time
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

WINDOW = 60
MAX_REQUESTS = 100


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self._counts: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_start = now - WINDOW
        self._counts[ip] = [t for t in self._counts[ip] if t > window_start]
        if len(self._counts[ip]) >= MAX_REQUESTS:
            return JSONResponse({"detail": "Rate limit exceeded"}, status_code=429)
        self._counts[ip].append(now)
        return await call_next(request)
