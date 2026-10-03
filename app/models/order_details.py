from datetime import datetime
from typing import List, Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class OrderDetails(Base):
    __tablename__ = "order_details"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL")
    )
    address_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("addresses.id", ondelete="SET NULL")
    )
    total: Mapped[int] = mapped_column(BigInteger, nullable=False)
    status: Mapped[Optional[str]] = mapped_column(String(50), default="pending")
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )

    user: Mapped[Optional["User"]] = relationship(back_populates="order_details")
    address: Mapped[Optional["Address"]] = relationship(
        back_populates="order_details"
    )
    items: Mapped[List["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )
    payments: Mapped[List["PaymentDetails"]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )
