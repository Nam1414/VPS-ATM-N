from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(50))
    address_line = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    country = Column(String(50), default="Việt Nam")
    phone_number = Column(String(15), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="addresses")
    order_details = relationship("OrderDetails", back_populates="address")

