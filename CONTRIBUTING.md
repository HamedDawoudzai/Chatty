# Contributing

## Development Setup

1. Fork and clone the repo
2. Follow [docs/setup.md](docs/setup.md)
3. Create a feature branch: `git checkout -b feat/my-feature`
4. Make changes with tests
5. Submit a pull request

## Code Style

- Backend: black + ruff formatting
- Frontend: ESLint + TypeScript strict mode
- Commit messages: [Conventional Commits](https://www.conventionalcommits.org/)

## Testing

```bash
# Backend
pytest --cov=backend

# Frontend
cd frontend && npm test

# E2E
npx playwright test
```
