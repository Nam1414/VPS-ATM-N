from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Đã thêm import CORS
from app.api.v1.api import api_router

app = FastAPI(title="Web Ban Hang API")

# THÊM ĐOẠN NÀY ĐỂ MỞ CỬA CHO FE TRUY CẬP (Xử lý lỗi CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tạm thời cho phép tất cả các port truy cập để mai báo cáo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router API
app.include_router(api_router, prefix="/api/v1")

# Phần code phía dưới giữ nguyên
@app.get("/")
def read_root():
    return {"message": "FastAPI đang chạy "}

@app.get("/health")
def health_check():
    return {"status": "ok"}