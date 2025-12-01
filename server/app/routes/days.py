import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..deps import get_current_user, get_db_session
from ..models import Day, User
from ..schemas import DayCreate, DayRead

router = APIRouter(prefix="/days", tags=["days"])


def _serialize(day: Day) -> DayRead:
    payload = json.loads(day.payload) if day.payload else {}
    return DayRead.model_validate({
        "id": day.id,
        "date": day.date,
        "payload": payload,
        "created_at": day.created_at,
    })


@router.get("/", response_model=List[DayRead])
def list_days(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
) -> list[DayRead]:
    statement = select(Day).where(Day.user_id == current_user.id).order_by(Day.created_at.desc())
    return [_serialize(day) for day in session.exec(statement).all()]


@router.post("/", response_model=DayRead, status_code=status.HTTP_201_CREATED)
def create_day(
    payload: DayCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
) -> DayRead:
    # Prevent duplicates per day if desired
    existing = session.exec(
        select(Day).where(Day.user_id == current_user.id, Day.date == payload.date)
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Day already saved")

    day = Day(user_id=current_user.id, date=payload.date, payload=json.dumps(payload.payload))
    session.add(day)
    session.commit()
    session.refresh(day)
    return _serialize(day)
