from fastapi import APIRouter, Header, Body, Depends, Query
from typing import Dict, Any, Annotated, List

from fastapi.security import OAuth2PasswordBearer

from tokenProcessing import *

from validation.profile import results

from logic.TestsLogic import TestsLogic
Test = TestsLogic()

router = APIRouter(
    prefix="/profile",
    tags=["profile"]   
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    return await Tokens.decode_acess_token(token)


@router.get(
    "/results",
    summary="Получение истории тестов",
    status_code=200
)
async def get_my_results(
        request_headers: Annotated[JWTInfo, Depends(get_current_user)],
        request_query: Annotated[results.RequestQueryModel, Query()]
    ) -> List[results.ResponceModel]:
    data = await Test.get_my_results(
        userId=request_headers.userId,
        start=request_query.start,
        count=request_query.count
    )
    return [
        results.ResponceModel(
            startTimesamp=elem.start,
            finishTimestamp=elem.finish,
            testId=elem.testId,
            score=elem.score
        )
        for elem in data
    ]