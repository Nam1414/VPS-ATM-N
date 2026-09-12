from datetime import datetime
from typing import List, Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="SET NULL")
    )
    seller_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)
    cover: Mapped[Optional[str]] = mapped_column(String(255))
    price: Mapped[int] = mapped_column(BigInteger, nullable=False)
    condition_status: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[Optional[str]] = mapped_column(String(50), default="available")
    stock_quantity: Mapped[Optional[int]] = mapped_column(Integer, default=0)
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    category: Mapped[Optional["Category"]] = relationship(back_populates="products")
    seller: Mapped[Optional["User"]] = relationship(back_populates="products")
    images: Mapped[List["ProductImage"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
    cart_items: Mapped[List["CartItem"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
    order_items: Mapped[List["OrderItem"]] = relationship(back_populates="product")
    wishlist_items: Mapped[List["Wishlist"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
