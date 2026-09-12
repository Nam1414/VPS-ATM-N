from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict, field_validator


class UserRegister(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Mật khẩu phải có ít nhất 6 ký tự")
        return v


class UserLogin(BaseModel):
    identifier: str  # email hoặc username
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    username: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: Optional[str] = None
    created_at: Optional[datetime] = None
