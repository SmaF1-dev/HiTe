from fastapi import APIRouter, Header, Body, Depends
from typing import Dict, Any, Annotated

from fastapi.security import OAuth2PasswordBearer

from tokenProcessing import *

from validation.tests import addTest, getTest, checkTest, testInfo
from validation.tests.components import testCard

from logic.TestsLogic import TestsLogic
Test = TestsLogic()

router = APIRouter(
    prefix="/tests",
    tags=["tests"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> JWTInfo:
    return await Tokens.decode_acess_token(token)


@router.post(
    "/add",
    summary="Добавление теста",
    status_code=200
)
async def create_test(
        request_headers: Annotated[JWTInfo, Depends(get_current_user)],
        test_info: Annotated[addTest.RequestSchema, Body()]
    ) -> addTest.ResponceSchema:
    res = await Test.create_test(
        userId=request_headers.userId,
        title=test_info.title,
        description=test_info.description,
        questions=test_info.questionCards
    )
    return addTest.ResponceSchema(
        testId=res.testId,
        title=res.title
    )

@router.get(
    "/info/{test_id}",
    summary="Информация о тесте",
    tags=["tests"],
    status_code=200
)
async def get_test_info(
        test_id: int
    ) -> testInfo.ResponceSchema:
    result = await Test.get_test_info(
        testId=test_id
    )
    return testInfo.ResponceSchema(
        testId=result.testId,
        title=result.title
    )

@router.post(
    "/start/{test_id}",
    summary="Старт теста",
    tags=["tests"],
    status_code=200
)
async def get_test(
        request_headers: Annotated[JWTInfo, Depends(get_current_user)],
        test_id: int
    ) -> getTest.ResponceSchema:
    result = await Test.start_test(
        testId=test_id,
        userId=request_headers.userId
    )
    return getTest.ResponceSchema(
        testId=result.testId,
        title=result.title,
        description=result.description,
        resultIdBypass=result.resultIdBypass,
        questionCards=[
            testCard.TestCardTruncated(
                title=question.title,
                cardId=question.cardId,
                description=question.description
            )
            for question in result.questionCards
        ]
    )


@router.post(
    "/check/{test_id}",
    summary="Проверка теста",
    tags=["tests"],
    status_code=200
)
async def check_test(
        request_headers: Annotated[JWTInfo, Depends(get_current_user)],
        request_body: Annotated[checkTest.RequestSchema, Body()],
        test_id: int
    ) -> checkTest.ResponceSchema:
    test_info = await Test.finish_test(
        testId=test_id,
        answers=request_body.answers,
        resultIdBypass=request_body.bypassedResultId
    )

    return checkTest.ResponceSchema(
        testId=test_info.testId,
        score=test_info.result,
        questionCards=[
            checkTest.TestCard(
                cardId=card.cardId,
                isCorrect=card.isCorrect,
                highlight=[
                    checkTest.TestCardHighliht(
                        bounds=elem.bounds,
                        color=elem.color
                    )
                    for elem in card.highlight
                ]
            )
            for card in test_info.answers
        ]
    )