import uvicorn
from fastapi import FastAPI
from routes.resources import resource
from routes.login import auth
from routes.register import register
from routes.create_test import create

app = FastAPI()
app.include_router(resource)
app.include_router(auth)
app.include_router(register)
app.include_router(create)

if __name__ == "__main__":
    uvicorn.run(app, host='127.0.0.1', port=8000)