from pydantic import BaseModel

class RequestModel(BaseModel):
    login: str
    password: str