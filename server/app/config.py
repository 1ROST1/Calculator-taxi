from functools import lru_cache
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Taxi Calculator API"
    secret_key: str = "change-me-in-prod"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    algorithm: str = "HS256"
    db_url: str = "sqlite:///./data.db"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:4173"]

    model_config = SettingsConfigDict(env_file=".env", env_prefix="CALC_", extra="ignore")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
