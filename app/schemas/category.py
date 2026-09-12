from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    parent_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None
