from typing import Annotated, List
from pydantic import BaseModel, Field

from .components.testCard import TestCardTruncated

class ResponceSchema(BaseModel):
    testId: int
    resultIdBypass: int = Field(
        example=1, # type: ignore
        description="Идентификатор сессии"
    )
    title: str = Field(
        example="test_name", # type: ignore
        description="Test Name"
    )
    description: str
    questionCards: List[TestCardTruncated]
    