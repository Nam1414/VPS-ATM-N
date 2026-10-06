from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.current_timestamp()
    )

    product: Mapped["Product"] = relationship(back_populates="images")
