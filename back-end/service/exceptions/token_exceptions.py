from fastapi import HTTPException, status


class CantDecodeJWT(HTTPException):
    '''
        Token Exception dataclass. Signals, that library can't decode JWT for some reason.
    '''
    def __init__(self):
        self.code = status.HTTP_401_UNAUTHORIZED
        self.detail = "Can't decode JWT. Maybe it expired?"
        self.headers = {"WWW-Authenticate": "Bearer"}

class NotEnoughPremissions(HTTPException):
    '''
        Token Exception dataclass. Signals, that there're not enough premissions
    '''
    def __init__(self):
        self.code = status.HTTP_403_FORBIDDEN
        self.detail = "You have not enough premissions for this operation"