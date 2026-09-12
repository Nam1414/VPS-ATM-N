from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

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
    stmt = select(Product).where(Product.deleted_at.is_(None))

    if category_id is not None:
        stmt = stmt.where(Product.category_id == category_id)

    if search:
        stmt = stmt.where(Product.name.ilike(f"%{search}%"))

    stmt = stmt.offset(skip).limit(limit)
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
        status=payload.status,
        stock_quantity=payload.stock_quantity,
    )

    for url in payload.image_urls:
        product.images.append(ProductImage(image_url=url))

    db.add(product)
    db.commit()
    db.refresh(product)
    return product
