from typing import Optional

from pydantic import BaseModel, ConfigDict


class AddressCreate(BaseModel):
    title: Optional[str] = None
    address_line: str
    city: str
    country: Optional[str] = "Việt Nam"
    phone_number: str


class AddressOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: Optional[str] = None
    address_line: str
    city: str
    country: Optional[str] = None
    phone_number: str
