FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry && poetry config virtualenvs.create false && poetry install --no-dev --no-interaction

COPY . .

RUN chmod +x backend/entrypoint.sh
ENTRYPOINT ["backend/entrypoint.sh"]
