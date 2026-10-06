from datetime import datetime
from typing import Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class OrderItem(Base):
    __tablename__ = "order_item"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("order_details.id", ondelete="CASCADE"), nullable=False
    )
    product_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("products.id", ondelete="SET NULL")
    )
    quantity: Mapped[Optional[int]] = mapped_column(Integer, default=1)
    price_at_buy: Mapped[int] = mapped_column(BigInteger, nullable=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )

    order: Mapped["OrderDetails"] = relationship(back_populates="items")
    product: Mapped[Optional["Product"]] = relationship(back_populates="order_items")
