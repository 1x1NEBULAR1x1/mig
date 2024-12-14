from pydantic import BaseModel, Field
from datetime import datetime
from humps.camel import case

class CodeBase(BaseModel):
    phone_number: int = Field(..., description="User phone number", examples=[1234567890], ge=0, max_length=10,
                              min_length=10)
    code: int = Field(..., description="Code", examples=[123456], ge=0, max_length=6, min_length=6)
    expiration: datetime = Field(..., description="Code expiration date", examples=["2024/01/01 00:00:00"])
    is_used: bool = Field(..., description="Code usage status", examples=[False])

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class CodeCreate(CodeBase):
    pass

class CodeUpdate(CodeBase):
    id: int = Field(..., description="Code ID", examples=[1], ge=0)

class CodeRead(CodeUpdate):
    created: datetime = Field(..., description="Code creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Code update date", examples=["2024/01/01 00:00:00"])