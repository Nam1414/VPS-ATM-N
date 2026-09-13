from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models import User
from app.schemas.user import Token, UserLogin, UserOut, UserRegister

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        or_(User.email == payload.email, User.username == payload.username)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email hoặc Username đã tồn tại",
        )

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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai thông tin đăng nhập",
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token)


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user
