from fastapi import HTTPException, status


class ObjectNotFound(HTTPException):
    '''
        Token Exception dataclass. Signals, that library can't decode JWT for some reason.
    '''
    def __init__(self):
        self.code = status.HTTP_404_NOT_FOUND
        self.detail = "Can't find this object"