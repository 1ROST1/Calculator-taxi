import time
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: int = Field(default_factory=lambda: int(time.time()))

    days: list["Day"] = Relationship(back_populates="user")


class Day(SQLModel, table=True):
    __tablename__ = "days"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    date: str = Field(index=True)
    payload: str
    created_at: int = Field(default_factory=lambda: int(time.time()))

    user: Optional[User] = Relationship(back_populates="days")
