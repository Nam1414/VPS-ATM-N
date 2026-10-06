from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    avatar: Mapped[Optional[str]] = mapped_column(String)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    birth_of_date: Mapped[Optional[date]] = mapped_column(Date)
    phone_number: Mapped[Optional[str]] = mapped_column(String(15))
    role: Mapped[Optional[str]] = mapped_column(String(20), default="user")
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    addresses: Mapped[List["Address"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    carts: Mapped[List["Cart"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    order_details: Mapped[List["OrderDetails"]] = relationship(
        back_populates="user"
    )
    products: Mapped[List["Product"]] = relationship(
        back_populates="seller", cascade="all, delete-orphan"
    )
    wishlist_items: Mapped[List["Wishlist"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
