from fastapi import FastAPI

from app.api.v1.api import api_router

app = FastAPI(title="Web Ban Hang API")

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "API is running"}
