from fastapi import APIRouter

from app.api.v1.endpoints import addresses, auth, cart, orders, products

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(cart.router)
api_router.include_router(addresses.router)
api_router.include_router(orders.router)
