import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy import or_, func
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

import string
import random

from app.api.deps import get_current_user, get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.core.config import settings
from app.models import User, OrderDetails, Product
from app.schemas.user import Token, UserLogin, UserOut, UserRegister

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar: Optional[str] = None

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str

class ForgotPassword(BaseModel):
    email: str

def send_real_email(to_email: str, subject: str, content: str):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("LỖI: Chưa cấu hình SMTP_USER và SMTP_PASSWORD trong file .env")
        return

    msg = MIMEMultipart()
    msg['From'] = settings.SMTP_USER
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(content, 'plain', 'utf-8'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        server.quit()
        print(f"✅ Đã gửi email thành công tới {to_email}")
    except Exception as e:
        print(f"❌ Lỗi gửi email: {e}")


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        or_(User.email == payload.email, User.username == payload.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email hoặc Username đã tồn tại")

    user = User(
        full_name=payload.full_name,
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        phone_number=payload.phone_number,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        or_(User.email == payload.identifier, User.username == payload.identifier)
    ).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không chính xác")

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token)

# ĐÃ XÓA DÒNG @router.post BỊ THỪA Ở ĐÂY
def generate_temp_password(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

@router.post("/forgot-password")
def forgot_password(payload: ForgotPassword, bg_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    
    if not user:
        return {"message": "Nếu email tồn tại, hệ thống đã gửi link đặt lại mật khẩu."}
    
    temp_password = generate_temp_password()
    user.password_hash = hash_password(temp_password)
    db.add(user)
    db.commit()

    email_content = f"""
Chào {user.full_name},
    
Hệ thống 2HAND.VN vừa nhận được yêu cầu khôi phục mật khẩu từ bạn.
    
MẬT KHẨU TẠM THỜI MỚI CỦA BẠN LÀ: {temp_password}
    
Vui lòng quay lại trang chủ, đăng nhập bằng mật khẩu tạm này. Sau đó, hãy truy cập phần "Hồ sơ cá nhân" để tiến hành Đổi lại mật khẩu của riêng bạn nhằm đảm bảo an toàn.
    
Trân trọng,
Đội ngũ quản trị 2HAND.VN
"""
    
    bg_tasks.add_task(
        send_real_email, 
        to_email=user.email, 
        subject="[2HAND.VN] Khôi phục mật khẩu tài khoản của bạn", 
        content=email_content
    )
    
    return {"message": "Nếu email tồn tại, hệ thống đã gửi mật khẩu khôi phục."}


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_me(payload: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.full_name is not None: current_user.full_name = payload.full_name
    if payload.phone_number is not None: current_user.phone_number = payload.phone_number
    if payload.avatar is not None: current_user.avatar = payload.avatar
        
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/me/password")
def update_password(payload: PasswordUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(payload.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Mật khẩu cũ không chính xác")
        
    current_user.password_hash = hash_password(payload.new_password)
    db.add(current_user)
    db.commit()
    return {"message": "Đổi mật khẩu thành công"}

@router.get("/admin/stats")
def get_admin_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập Admin")
    
    total_users = db.query(func.count(User.id)).scalar()
    total_orders = db.query(func.count(OrderDetails.id)).scalar()
    total_products = db.query(func.count(Product.id)).scalar()
    
    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_products": total_products
    }