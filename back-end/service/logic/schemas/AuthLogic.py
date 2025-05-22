from pydantic import BaseModel

class UserDTO(BaseModel):
    userId: int
    login: str
    isAdmin: bool