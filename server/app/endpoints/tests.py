from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud, security
from ..database import get_db

router = APIRouter(prefix="/tests", tags=["tests"])

@router.post("/", response_model=schemas.Test)
def create_test(
    test: schemas.TestCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    return crud.create_test(db=db, test=test, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Test])
def read_tests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tests = crud.get_tests(db, skip=skip, limit=limit)
    return tests

@router.post("/{test_id}/results", response_model=schemas.TestResult)
def create_result(
    test_id: int,
    result: schemas.TestResultCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    return crud.create_test_result(db=db, result=result)