# Chatty

A real-time chat application built with **FastAPI**, **WebSockets**, **React**, and **TypeScript**.

## Features

- User registration and login with JWT
- Chat rooms (create, join, leave) and direct messages
- Real-time messaging via WebSockets
- Message history with pagination and infinite scroll
- Typing indicators, online presence, read receipts
- Emoji reactions, message threads, pinned messages
- File attachments, link previews
- @mentions, #channel links, emoji shortcode autocomplete
- Push notifications via Redis pubsub
- Message edit, delete, search
- Dark mode, user profiles with avatar upload
- Role-based room admin system
- Rate limiting, request ID tracing middleware

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, WebSockets, PostgreSQL, Redis |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Auth | JWT, bcrypt |
| Infra | Docker, GitHub Actions, Nginx, Sentry, Prometheus |

## Quick Start

See [docs/setup.md](docs/setup.md) for full setup instructions.

```bash
docker-compose up -d
```

Open http://localhost

## License

MIT
