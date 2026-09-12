from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.category import CategoryOut


class ProductImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_url: str


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    summary: Optional[str] = None
    description: Optional[str] = None
    cover: Optional[str] = None
    price: int
    condition_status: Optional[str] = None
    status: Optional[str] = None
    stock_quantity: Optional[int] = None
    created_at: Optional[datetime] = None
    category: Optional[CategoryOut] = None
    images: List[ProductImageOut] = []


class ProductListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    summary: Optional[str] = None
    cover: Optional[str] = None
    price: int
    status: Optional[str] = None
    stock_quantity: Optional[int] = None
    category_id: Optional[int] = None


class ProductCreate(BaseModel):
    category_id: Optional[int] = None
    name: str
    summary: Optional[str] = None
    description: Optional[str] = None
    cover: Optional[str] = None
    price: int = Field(gt=0)
    condition_status: Optional[str] = None
    status: Optional[str] = "available"
    stock_quantity: int = 0
    image_urls: List[str] = []


class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    cover: Optional[str] = None
    price: Optional[int] = Field(default=None, gt=0)
    condition_status: Optional[str] = None
    status: Optional[str] = None
    stock_quantity: Optional[int] = None
