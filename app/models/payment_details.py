from datetime import datetime
from typing import Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class PaymentDetails(Base):
    __tablename__ = "payment_details"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("order_details.id", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    provider: Mapped[Optional[str]] = mapped_column(String(50))
    status: Mapped[Optional[str]] = mapped_column(String(50), default="unpaid")
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )

    order: Mapped["OrderDetails"] = relationship(back_populates="payments")
