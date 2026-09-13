from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user, get_db, require_role
from app.core.vietqr import build_vietqr_url
from app.models import (
    Address,
    Cart,
    CartItem,
    OrderDetails,
    OrderItem,
    PaymentDetails,
    Product,
    User,
)
from app.schemas.order import CheckoutRequest, OrderOut, OrderStatusUpdate, PaymentOut

router = APIRouter(prefix="/orders", tags=["Orders"])


def _order_query():
    return select(OrderDetails).options(
        selectinload(OrderDetails.address),
        selectinload(OrderDetails.items),
        selectinload(OrderDetails.payments),
    )


def _serialize_order(order: OrderDetails) -> OrderOut:
    payments = [
        PaymentOut(
            id=p.id,
            amount=p.amount,
            provider=p.provider,
            status=p.status,
            qr_url=build_vietqr_url(p.amount, order.id) if p.status == "unpaid" else None,
        )
        for p in order.payments
    ]
    return OrderOut(
        id=order.id,
        total=order.total,
        status=order.status,
        created_at=order.created_at,
        address=order.address,
        items=order.items,
        payments=payments,
    )


@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def checkout(
    payload: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_stmt = (
        select(Cart)
        .where(Cart.user_id == current_user.id)
        .options(selectinload(Cart.items).selectinload(CartItem.product))
    )
    cart = db.scalars(cart_stmt).first()

    if not cart or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Giỏ hàng đang trống"
        )

    # Xác định địa chỉ giao hàng
    if payload.address_id is not None:
        address = db.get(Address, payload.address_id)
        if (
            not address
            or address.user_id != current_user.id
            or address.deleted_at is not None
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="address_id không hợp lệ",
            )
    elif payload.new_address is not None:
        address = Address(user_id=current_user.id, **payload.new_address.model_dump())
        db.add(address)
        db.flush()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cần cung cấp address_id hoặc new_address",
        )

    try:
        # Kiểm tra tồn kho trước khi trừ
        for item in cart.items:
            product = item.product
            if product is None or product.deleted_at is not None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Sản phẩm id={item.product_id} không còn tồn tại",
                )
            if (
                product.stock_quantity is not None
                and item.quantity > product.stock_quantity
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Sản phẩm '{product.name}' chỉ còn {product.stock_quantity} trong kho",
                )

        order_total = sum(item.quantity * item.product.price for item in cart.items)

        order = OrderDetails(
            user_id=current_user.id,
            address_id=address.id,
            total=order_total,
            status="pending",
        )
        db.add(order)
        db.flush()

        for item in cart.items:
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price_at_buy=item.product.price,
                )
            )
            item.product.stock_quantity -= item.quantity
            db.add(item.product)

        db.add(
            PaymentDetails(
                order_id=order.id,
                amount=order_total,
                provider=payload.payment_provider,
                status="unpaid",
            )
        )

        for item in list(cart.items):
            db.delete(item)
        cart.total = 0
        db.add(cart)

        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Đặt hàng thất bại, vui lòng thử lại",
        )

    db.refresh(order)
    order = db.scalars(_order_query().where(OrderDetails.id == order.id)).first()
    return _serialize_order(order)


@router.get("", response_model=List[OrderOut])
def list_my_orders(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    stmt = _order_query().where(OrderDetails.user_id == current_user.id)
    orders = db.scalars(stmt).all()
    return [_serialize_order(o) for o in orders]


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = _order_query().where(OrderDetails.id == order_id)
    order = db.scalars(stmt).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Đơn hàng không tồn tại"
        )

    if order.user_id != current_user.id and current_user.role not in (
        "admin",
        "seller",
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem đơn hàng này",
        )

    return _serialize_order(order)


@router.put("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    current_user: User = Depends(require_role("admin", "seller")),
    db: Session = Depends(get_db),
):
    order = db.get(OrderDetails, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Đơn hàng không tồn tại"
        )

    order.status = payload.status
    db.add(order)
    db.commit()

    stmt = _order_query().where(OrderDetails.id == order_id)
    order = db.scalars(stmt).first()
    return _serialize_order(order)
