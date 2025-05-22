import jwt

from settings.Settings import SecuritySettings
from datetime import timedelta, datetime, timezone

from .objects import *
from exceptions.token_exceptions import *

class Tokens():
    @staticmethod
    async def generate_acess_token(userId: int, isAdmin: bool) -> str:
        exp = int(
                datetime.timestamp(
                    datetime.now(timezone.utc) + timedelta(minutes=SecuritySettings.ACCESS_TOKEN_EXPIRE_MINUTES)
                )
            )
        payload = {
            "userId": userId,
            "isAdmin": isAdmin,
            "exp": exp
        }

        return jwt.encode(payload, key = SecuritySettings.SECURITY_KEY, algorithm = SecuritySettings.ALGORYTM)
    
    @staticmethod
    async def decode_acess_token(token: str) -> JWTInfo:
        '''
            Function, which decodes JWT token and returns JWTInfo object
            Args:
                token (str):
                    JWT token, which should be decoded
            Returns:
                JWTInfo:
                    Object with data from JWT token
            Raises:
                CantDecodeJWT:
                    If token can't be decoded
        '''
        #token = token[7:] if "Bearer" in token else token
        try:
            payload = jwt.decode(
                token,
                key = SecuritySettings.SECURITY_KEY,
                algorithms = [SecuritySettings.ALGORYTM]
            )
            return JWTInfo(**payload)
        except Exception as e:
            raise CantDecodeJWT
    
    @staticmethod
    async def checkPremissions(
        token: JWTInfo,
        isAdmin: bool = False
    ) -> None:
        if isAdmin and not token.isAdmin:
            raise NotEnoughPremissions