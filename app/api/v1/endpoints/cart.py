from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user, get_db
from app.models import Cart, CartItem, Product, User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartOut

router = APIRouter(prefix="/cart", tags=["Cart"])


def _get_or_create_cart(db: Session, user_id: int) -> Cart:
    stmt = (
        select(Cart)
        .where(Cart.user_id == user_id)
        .options(selectinload(Cart.items).selectinload(CartItem.product))
    )
    cart = db.scalars(stmt).first()

    if not cart:
        cart = Cart(user_id=user_id, total=0)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart


def _recalculate_total(db: Session, cart: Cart) -> None:
    db.refresh(cart)
    cart.total = sum(item.quantity * item.product.price for item in cart.items)
    db.add(cart)
    db.commit()
    db.refresh(cart)


@router.get("", response_model=CartOut)
def get_cart(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    cart = _get_or_create_cart(db, current_user.id)
    return cart


@router.post("/items", response_model=CartOut, status_code=status.HTTP_201_CREATED)
def add_item(
    payload: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = _get_or_create_cart(db, current_user.id)

    product = db.get(Product, payload.product_id)
    if not product or product.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sản phẩm không tồn tại"
        )

    existing_item = next(
        (i for i in cart.items if i.product_id == payload.product_id), None
    )
    new_quantity = payload.quantity + (existing_item.quantity if existing_item else 0)

    if product.stock_quantity is not None and new_quantity > product.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Chỉ còn {product.stock_quantity} sản phẩm trong kho",
        )

    if existing_item:
        existing_item.quantity = new_quantity
        db.add(existing_item)
    else:
        db.add(CartItem(cart_id=cart.id, product_id=product.id, quantity=payload.quantity))

    db.commit()
    _recalculate_total(db, cart)
    return cart


@router.put("/items/{item_id}", response_model=CartOut)
def update_item(
    item_id: int,
    payload: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = _get_or_create_cart(db, current_user.id)

    item = next((i for i in cart.items if i.id == item_id), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item không tồn tại trong giỏ"
        )

    if (
        item.product.stock_quantity is not None
        and payload.quantity > item.product.stock_quantity
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Chỉ còn {item.product.stock_quantity} sản phẩm trong kho",
        )

    item.quantity = payload.quantity
    db.add(item)
    db.commit()
    _recalculate_total(db, cart)
    return cart


@router.delete("/items/{item_id}", response_model=CartOut)
def remove_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = _get_or_create_cart(db, current_user.id)

    item = next((i for i in cart.items if i.id == item_id), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item không tồn tại trong giỏ"
        )

    db.delete(item)
    db.commit()
    _recalculate_total(db, cart)
    return cart


@router.delete("", response_model=CartOut)
def clear_cart(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    cart = _get_or_create_cart(db, current_user.id)

    for item in list(cart.items):
        db.delete(item)
    db.commit()

    cart.total = 0
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart
