from fastapi import FastAPI

from app.api.v1.api import api_router

app = FastAPI(title="Web Ban Hang API")

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "FastAPI đang chạy "}


@app.get("/health")
def health_check():
    return {"status": "ok"}
