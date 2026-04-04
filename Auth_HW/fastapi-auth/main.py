from fastapi import FastAPI
from src.controllers.auth_controller import router as auth_router

app = FastAPI(
    title="FastAPI",
    description="FastAPI",
)

app.include_router(auth_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Hello World"}