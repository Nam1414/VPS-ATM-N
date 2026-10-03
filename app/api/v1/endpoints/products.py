from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session, selectinload

from fastapi import BackgroundTasks
from pydantic import BaseModel
from app.models.product import Message, Offer
from app.models.wishlist import Wishlist

from app.api.deps import get_current_user, get_db
from app.models import Category, Product, ProductImage, User
from app.schemas.category import CategoryOut
from app.schemas.product import (
    ProductCreate,
    ProductListItem,
    ProductOut,
    ProductUpdate,
)

router = APIRouter(tags=["Products & Categories"])


@router.get("/categories", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    stmt = select(Category).where(Category.deleted_at.is_(None))
    return db.scalars(stmt).all()


@router.get("/products", response_model=List[ProductListItem])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    # CHỈ HIỂN THỊ CÁC SẢN PHẨM ĐÃ ĐƯỢC ADMIN DUYỆT ("available")
    stmt = select(Product).where(
        Product.deleted_at.is_(None),
        Product.status == "available"
    )

    if category_id is not None:
        stmt = stmt.where(Product.category_id == category_id)

    if search:
        stmt = stmt.where(Product.name.ilike(f"%{search}%"))

    stmt = stmt.offset(skip).limit(limit)
    return db.scalars(stmt).all()


# ================================================================
# THÊM API: LẤY DANH SÁCH TIN ĐĂNG CỦA CHÍNH TÀI KHOẢN ĐANG LOGIN
# ================================================================
@router.get("/products/me", response_model=List[ProductListItem])
def get_my_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stmt = select(Product).where(
        Product.deleted_at.is_(None),
        Product.seller_id == current_user.id
    )
    return db.scalars(stmt).all()


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    stmt = (
        select(Product)
        .where(Product.id == product_id, Product.deleted_at.is_(None))
        .options(selectinload(Product.category), selectinload(Product.images))
    )
    product = db.scalars(stmt).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sản phẩm không tồn tại"
        )

    return product


@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.category_id is not None:
        category = db.get(Category, payload.category_id)
        if not category or category.deleted_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="category_id không tồn tại",
            )

    product = Product(
        category_id=payload.category_id,
        seller_id=current_user.id,
        name=payload.name,
        summary=payload.summary,
        description=payload.description,
        cover=payload.cover,
        price=payload.price,
        condition_status=payload.condition_status,
        status="pending", # ÉP BUỘC TRẠNG THÁI CHỜ DUYỆT (Ẩn khỏi trang chủ)
        stock_quantity=payload.stock_quantity,
    )

    for url in payload.image_urls:
        product.images.append(ProductImage(image_url=url))

    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# ================================================================
# API CHO QUẢN TRỊ VIÊN (ADMIN) XỬ LÝ TIN ĐĂNG CHỜ DUYỆT
# ================================================================
@router.get("/admin/products/pending", response_model=List[ProductListItem])
def get_pending_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
        
    stmt = select(Product).where(
        Product.deleted_at.is_(None),
        Product.status == "pending"
    )
    return db.scalars(stmt).all()


@router.patch("/admin/products/{product_id}/approve")
def approve_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
        
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
        
    product.status = "available"
    db.commit()
    return {"message": "Đã duyệt sản phẩm thành công"}


# Schemas nhận dữ liệu
class ChatMessageCreate(BaseModel):
    receiver_id: int
    content: str

class OfferCreate(BaseModel):
    offer_price: int
    message: str

# Hàm mô phỏng gửi Email
def send_email_notification(email: str, subject: str, content: str):
    print(f"\n[{func.current_timestamp()}] 📧 ĐANG GỬI EMAIL ĐẾN: {email}")
    print(f"Tiêu đề: {subject}")
    print(f"Nội dung: {content}")
    print("====================================================\n")

# ================================================================
# API CHAT (NHẮN TIN)
# ================================================================
@router.post("/{product_id}/chat")
def send_chat_message(
    product_id: int,
    payload: ChatMessageCreate,
    bg_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    msg = Message(
        product_id=product_id,
        sender_id=current_user.id,
        receiver_id=payload.receiver_id,
        content=payload.content
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # Lấy thông tin người nhận để gửi mail
    receiver = db.get(User, payload.receiver_id)
    if receiver:
        bg_tasks.add_task(
            send_email_notification,
            email=receiver.email,
            subject="Bạn có tin nhắn mới trên 2HAND.VN",
            content=f"Người dùng {current_user.full_name} vừa nhắn cho bạn: '{payload.content}'"
        )
    return msg

@router.get("/{product_id}/chat")
def get_chat_history(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stmt = select(Message).where(
        Message.product_id == product_id,
        or_(Message.sender_id == current_user.id, Message.receiver_id == current_user.id)
    ).order_by(Message.created_at.asc())
    return db.scalars(stmt).all()

# ================================================================
# API TRẢ GIÁ (MAKE OFFER)
# ================================================================
@router.post("/{product_id}/offers")
def make_offer(
    product_id: int,
    payload: OfferCreate,
    bg_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")

    offer = Offer(
        product_id=product.id,
        buyer_id=current_user.id,
        offer_price=payload.offer_price,
        message=payload.message
    )
    db.add(offer)
    db.commit()

    seller = db.get(User, product.seller_id)
    if seller:
        bg_tasks.add_task(
            send_email_notification,
            email=seller.email,
            subject=f"Đề nghị mua mới cho sản phẩm: {product.name}",
            content=f"{current_user.full_name} vừa trả giá {payload.offer_price:,}đ. Tin nhắn: {payload.message}"
        )
    return offer

# ================================================================
# API YÊU THÍCH (WISHLIST)
# ================================================================
@router.post("/{product_id}/wishlist")
def toggle_wishlist(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stmt = select(Wishlist).where(Wishlist.user_id == current_user.id, Wishlist.product_id == product_id)
    item = db.scalars(stmt).first()
    
    if item:
        db.delete(item)
        db.commit()
        return {"message": "Đã xóa khỏi yêu thích", "liked": False}
    else:
        new_like = Wishlist(user_id=current_user.id, product_id=product_id)
        db.add(new_like)
        db.commit()
        return {"message": "Đã lưu vào yêu thích", "liked": True}