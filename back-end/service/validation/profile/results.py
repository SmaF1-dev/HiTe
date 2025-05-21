from pydantic import BaseModel, Field

class RequestQueryModel(BaseModel):
    start: int = Field(
        example=0, # type: ignore
        default=0,
        description="С какого результата начать"
    )
    count: int = Field(
        example=10, # type: ignore
        default=10,
        lt=30,
        description="Сколько результатов вывести"
    )

class ResponceModel(BaseModel):
    startTimesamp: int = Field(
        example=1000000, # type: ignore
        description="Время начала теста в сек (Unix epoch)"
    )
    finishTimestamp: int | None = Field(
        example=1000050, # type: ignore
        description="Время конца теста в сек (Unix epoch)"
    )
    testId: int
    score: int | None = Field(
        example=1, # type: ignore
        description="Сколько баллов набрано в тесте"
    )