'''
    ## CAN BE UNSAFE
    
    ? Audit auth system
    ? ASAP rewrite to SessionId(Redis) inside JWT auth
'''

from fastapi import APIRouter, Header, Body
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from typing import Dict, Any, Annotated

from tokenProcessing import *
from logic.AuthLogic import AuthLogic

from validation.auth import register

Auth = AuthLogic()

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    return await Tokens.decode_acess_token(token)


@router.post(
    "/register",
    summary="Регистрация нового пользователя",
    status_code=200
)
async def register_(
    auth_data: Annotated[register.RequestModel, Depends()] ,
):
    user = await Auth.register_by_login(
        login=auth_data.login,
        password=auth_data.password,
        isAdmin=False
    )
    return Token(
            access_token=await Tokens.generate_acess_token(userId=user.userId, isAdmin=user.isAdmin),
            token_type="bearer",
    )

@router.post(
    "/login",
    summary="Вход",
    status_code=200
)
async def login(
    auth_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = await Auth.sign_in_by_login(
        login=auth_data.username,
        password=auth_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(
            access_token=await Tokens.generate_acess_token(userId=user.userId, isAdmin=user.isAdmin),
            token_type="bearer",
    )