from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from .. import auth as auth_utils
from ..deps import get_db_session
from ..models import User
from ..schemas import AuthResponse, LoginRequest, Token, UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, session: Session = Depends(get_db_session)) -> AuthResponse:
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user = User(email=payload.email, hashed_password=auth_utils.hash_password(payload.password))
    session.add(user)
    session.commit()
    session.refresh(user)

    token = auth_utils.create_access_token(subject=user.email)
    return AuthResponse(token=Token(access_token=token), user=UserRead.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, session: Session = Depends(get_db_session)) -> AuthResponse:
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not auth_utils.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = auth_utils.create_access_token(subject=user.email)
    return AuthResponse(token=Token(access_token=token), user=UserRead.model_validate(user))
