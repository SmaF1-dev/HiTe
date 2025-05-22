'''
    Implementation of RESTful API
    
    For more info see docstrings in api directory!
'''

from settings.Settings import Settings

from fastapi import FastAPI, Query, HTTPException, Request, APIRouter, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from fastapi.encoders import jsonable_encoder
from fastapi.openapi.utils import get_openapi

from api import auth, profile, tests

from typing_extensions import Annotated
# -- INIT BLOCK --

class OverrideValErr(BaseModel):
    description: str = "Validation Error"
    code: int = 422

responses = {
    422: {'model': OverrideValErr, 'description': 'Validation Error'}
}

app = FastAPI(
    title="HiTe API",
    version="0.0.1",
    responses={**responses},
    root_path=f"/v{Settings.API_VERSION}",
)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(profile.router)
app.include_router(auth.router)
app.include_router(tests.router)


# -- MAIN BLOCK --

@app.exception_handler(RequestValidationError)
async def validationException_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    '''
        Function, which catches ValidationError from pydantic and sends info about it to client
        Args:
            request (Request):
                Not used, but requried argument. Contains data about request
            exc (RequestValidationError):
                A class with data about exception
        Returns:
            obj (HTTPException): 
                Data about error in json format
        
        ## Note
            DO NOT CALL IT DIRECTLY
    '''
    errors_string = ""
    for error in exc._errors:
        errors_string += rf"In {error['loc'][-1]}: {error['msg']}. "
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "description": errors_string[:-1:],
            "code": 422
        }
    )

@app.get(
    f'/ping',
    summary="ping",
    status_code=200
)
async def send_pong():
    '''
        GET request to test avilability of server. See in /api/ping
    '''
    return {"status": "ok"}

if __name__ == "__main__":
    app.run()