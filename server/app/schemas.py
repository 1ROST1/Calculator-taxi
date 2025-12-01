from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    token: Token
    user: "UserRead"


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserRead(UserBase):
    id: int
    created_at: int

    class Config:
        from_attributes = True


class LoginRequest(UserBase):
    password: str


class DayCreate(BaseModel):
    date: str
    payload: dict[str, Any]


class DayRead(BaseModel):
    id: int
    date: str
    payload: dict[str, Any]
    created_at: int

    class Config:
        from_attributes = True


AuthResponse.model_rebuild()
