from typing import Optional

from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.sql import func
from src.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True )
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[Optional[DateTime]] = mapped_column(DateTime, server_default=func.now())

    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        "RefreshToken", back_populates="user", cascade="all, delete-orphan"
    )