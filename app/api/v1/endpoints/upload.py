from fastapi import APIRouter, UploadFile, File
from app.core.cloudinary import upload_image
from app.schemas.upload import UploadResponse

router = APIRouter()

@router.post("/image", response_model=UploadResponse, summary="Upload 1 ảnh lên Cloudinary")
async def upload_single_image(file: UploadFile = File(...)):
    
    url = await upload_image(file, folder="products")
    return UploadResponse(
        message="Upload ảnh thành công",
        image_url=url
    )


