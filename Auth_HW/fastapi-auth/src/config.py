from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_EXPIRED: str = "15m"
    JWT_REFRESH_SECRET: str
    JWT_REFRESH_EXPIRED: str = "7d" 
    REDIS_URL: str

    class Config:
        env_file = ".env"
    
settings = Settings()