from pydantic import BaseModel

class UploadResponse(BaseModel):
    message: str
    image_url: str
    