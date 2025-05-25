from dataclasses import dataclass

from typing import Dict
from exceptions.token_exceptions import *

from typing_extensions import Self, Literal, Annotated

from pydantic import BaseModel, Field, field_validator, ConfigDict

class JWTInfo(BaseModel):
    userId: int
    isAdmin: bool
    exp: int

class Token(BaseModel):
    access_token: Annotated[str, Field("Bearer token")]
    token_type: Literal["bearer"]
