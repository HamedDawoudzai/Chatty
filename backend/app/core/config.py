from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "postgresql://chatty:chatty@localhost:5432/chatty"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "dev-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    APP_ENV: str = "development"
    DEBUG: bool = True
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]
    STORAGE_BACKEND: str = "local"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_BUCKET_NAME: str = "chatty-uploads"
    AWS_REGION: str = "us-east-1"
    LOCAL_UPLOAD_DIR: str = "./uploads"
    SENTRY_DSN: str = ""
    MAX_FILE_SIZE_MB: int = 10

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def split_origins(cls, v):
        if isinstance(v, str):
            return [o.strip() for o in v.split(",")]
        return v


settings = Settings()
