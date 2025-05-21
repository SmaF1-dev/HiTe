from pydantic import BaseModel
from typing import List, Tuple

class TestDTO(BaseModel):
    title: str
    testId: int


class TestCardTruncatedDTO(BaseModel):
    title: str
    description: str
    cardId: int
    
class TestTruncatedDTO(BaseModel):
    testId: int
    resultIdBypass: int
    title: str
    description: str
    questionCards: List[TestCardTruncatedDTO]


class CardHighlightDTO(BaseModel):
    bounds: Tuple[int, int]
    color: str

class TestCardDTO(BaseModel):
    isCorrect: bool
    cardId: int
    title: str
    description: str
    highlight: List[CardHighlightDTO]

class TestFullDTO(BaseModel):
    title: str
    testId: int

    answers: List[TestCardDTO]
    result: int

class ResultDTO(BaseModel):
    testId: int
    start: int
    finish: int | None
    score: int | None