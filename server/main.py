import uvicorn
from fastapi import FastAPI
from routes.about import about
from routes.login import auth
from routes.register import register
from routes.create_test import create
from routes.edit_test import edit
from routes.pass_test import passing
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(about)
app.include_router(auth)
app.include_router(register)
app.include_router(create)
app.include_router(edit)
app.include_router(passing)

if __name__ == "__main__":
    uvicorn.run(app, host='127.0.0.1', port=8000)