from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, default=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartItemProductInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: int
    cover: Optional[str] = None


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quantity: int
    product: CartItemProductInfo


class CartOut(BaseModel):
    id: int
    items: List[CartItemOut]
    total: int
