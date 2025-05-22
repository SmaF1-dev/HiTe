from typing import Annotated, List, Tuple
from pydantic import BaseModel, Field

class TestCardHighlight(BaseModel):
    bounds: Annotated[
        Tuple[int, int],
        Field(
            example=[1,15], # type: ignore
            description="first and last index of highlighted section"
        )
    ]
    color:  Annotated[
        str,
        Field(
            example="#FF0000", # type: ignore
            description="highlight color"
        )
    ]
    
class TestCard(BaseModel):
    title: str = Field(
        example="test_card_name", # type: ignore
        description="Test Card Name"
    )
    isCorrect: bool = Field(
        example="Описание задания теста", # type: ignore
        description="Описание задания теста"
    )
    description: str = Field(
        example="Описание события", # type: ignore
        description="Описание события"
    )
    highlight: List[TestCardHighlight]

class TestCardTruncated(BaseModel):
    cardId: int
    title: str = Field(
        example="test_card_name", # type: ignore
        description="Test Card Name"
    )
    description: str = Field(
        example="Описание события", # type: ignore
        description="Описание события"
    )