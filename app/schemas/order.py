from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.address import AddressCreate, AddressOut


class CheckoutRequest(BaseModel):
    address_id: Optional[int] = None
    new_address: Optional[AddressCreate] = None
    payment_provider: str = Field(default="COD")


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: Optional[int] = None
    quantity: int
    price_at_buy: int


class PaymentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    amount: int
    provider: Optional[str] = None
    status: Optional[str] = None
    qr_url: Optional[str] = None


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    total: int
    status: Optional[str] = None
    created_at: Optional[datetime] = None
    address: Optional[AddressOut] = None
    items: List[OrderItemOut] = []
    payments: List[PaymentOut] = []


class OrderStatusUpdate(BaseModel):
    status: str
