from urllib.parse import quote

from app.core.config import settings


def build_vietqr_url(amount: int, order_id: int) -> str:
    add_info = quote(f"Thanh toan don hang {order_id}")
    account_name = quote(settings.VIETQR_ACCOUNT_NAME)

    return (
        f"https://img.vietqr.io/image/"
        f"{settings.VIETQR_BANK_ID}-{settings.VIETQR_ACCOUNT_NO}-{settings.VIETQR_TEMPLATE}.png"
        f"?amount={amount}&addInfo={add_info}&accountName={account_name}"
    )
