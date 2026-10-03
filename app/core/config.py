import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    VIETQR_BANK_ID: str = os.getenv("VIETQR_BANK_ID", "")
    VIETQR_ACCOUNT_NO: str = os.getenv("VIETQR_ACCOUNT_NO", "")
    VIETQR_ACCOUNT_NAME: str = os.getenv("VIETQR_ACCOUNT_NAME", "")
    VIETQR_TEMPLATE: str = os.getenv("VIETQR_TEMPLATE", "compact2")

    # CẤU HÌNH GỬI EMAIL THẬT
    SMTP_USER: str = os.getenv("SMTP_USER", "")      # Ví dụ: emailcuaban@gmail.com
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")  # Mật khẩu ứng dụng (App Password) của Gmail

settings = Settings()