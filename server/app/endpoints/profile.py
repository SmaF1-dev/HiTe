from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, security
from ..database import get_db

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/me", response_model=schemas.User)
def read_user_me(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    return current_user

@router.get("/results", response_model=list[schemas.TestResult])
def get_user_results(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    return current_user.results