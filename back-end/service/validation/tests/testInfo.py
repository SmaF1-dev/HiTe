from pydantic import BaseModel

class ResponceSchema(BaseModel):
    testId: int
    title: str