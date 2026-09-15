from fastapi import APIRouter, UploadFile, File
from app.core.cloudinary import upload_image, upload_multiple_images
from app.schemas.upload import UploadResponse, UploadMultipleResponse

router = APIRouter()

@router.post("/image", response_model=UploadResponse, summary="Upload 1 ảnh lên Cloudinary")
async def upload_single_image(file: UploadFile = File(...)):
    
    url = await upload_image(file, folder="products")
    return UploadResponse(
        message="Upload ảnh thành công",
        image_url=url
    )


@router.post("/images", response_model=UploadMultipleResponse, summary="Upload nhiều ảnh cùng lúc")
async def upload_batch_images(files: list[UploadFile] = File(...)):
    urls = await upload_multiple_images(files, folder="products")
    return UploadMultipleResponse(
        message=f"Upload thành công {len(urls)} ảnh",
        image_urls=urls
    )