from typing import Annotated, List, Tuple
from pydantic import BaseModel, Field

class CardAnswer(BaseModel):
    cardId: int
    answer: bool = Field(
        example=True, # type: ignore
        description="Ответ ученика, подходит ли карточка к заданию"
    )

class RequestSchema(BaseModel):
    answers: List[CardAnswer] = Field(
        description="Списки ответов"
    )
    bypassedResultId: int = Field(
        example=1, # type: ignore
        description="Идентификатор сессии"
    )


class TestCardHighliht(BaseModel):
    bounds: Tuple[int,int]
    color: Annotated[
        str,
        Field(
            example="#FF0000", # type: ignore
            description="highlight color"
        )
    ]

class TestCard(BaseModel):
    cardId: int
    isCorrect: bool = Field(
        example=True, # type: ignore
        description="Подходила ли карточка к заданию"
    )
    highlight: List[TestCardHighliht]

class ResponceSchema(BaseModel):
    testId: int
    score: int
    questionCards: List[TestCard]
