from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models import Address, User
from app.schemas.address import AddressCreate, AddressOut

router = APIRouter(prefix="/addresses", tags=["Addresses"])


@router.post("", response_model=AddressOut, status_code=status.HTTP_201_CREATED)
def create_address(
    payload: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    address = Address(user_id=current_user.id, **payload.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.get("", response_model=List[AddressOut])
def list_addresses(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    stmt = select(Address).where(
        Address.user_id == current_user.id, Address.deleted_at.is_(None)
    )
    return db.scalars(stmt).all()
