from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Wishlist(Base):
    __tablename__ = "wishlist"
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="wishlist_user_id_product_id_key"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )

    user: Mapped["User"] = relationship(back_populates="wishlist_items")
    product: Mapped["Product"] = relationship(back_populates="wishlist_items")
