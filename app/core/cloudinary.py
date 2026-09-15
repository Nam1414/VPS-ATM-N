import os
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException

#.env
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

async def upload_image(file: UploadFile, folder: str = "products") -> str:
    
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Chỉ cho phép upload file ảnh (jpg, png, webp)!")

    try:
        # Upload file 
        response = cloudinary.uploader.upload(
            file.file,
            folder=folder
        )
        return response.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi upload ảnh: {str(e)}")


async def upload_multiple_images(files: list[UploadFile], folder: str = "products") -> list[str]:
    urls = []
    for file in files:
        url = await upload_image(file, folder=folder)
        urls.append(url)
    return urls      