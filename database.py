import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.product import Product

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Product).limit(5))
        products = result.scalars().all()

        print(f"\n✅ Kết nối PostgreSQL thành công! Tìm thấy {len(products)} sản phẩm:\n")
        for p in products:
            print(f"[{p.id}] {p.name} | Giá: {p.price:,} VNĐ | Kho: {p.stock_quantity} | Status: {p.status}")

if __name__ == "__main__":
    asyncio.run(main())