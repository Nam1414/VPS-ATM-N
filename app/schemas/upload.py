from pydantic import BaseModel

class UploadResponse(BaseModel):
    message: str
    image_url: str
    

class UploadMultipleResponse(BaseModel):
    message: str
    image_urls: list[str]