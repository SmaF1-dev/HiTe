from typing import Annotated, List
from pydantic import BaseModel, Field

from .components.testCard import TestCard

class RequestSchema(BaseModel):
    title: str = Field(
        example="test_name", # type: ignore
        description="Test Name"
    )
    description: str = Field(
        example="Описание задания теста", # type: ignore
        description="Описание задания теста"
    )
    questionCards: List[TestCard]


class ResponceSchema(BaseModel):
    testId: int
    title: str = Field(
        example="test_name", # type: ignore
        description="Test Name"
    )