from pydantic import BaseModel, Field
from typing import Sequence
from datetime import datetime
from humps.camel import case

class TagBase(BaseModel):
    name: str = Field(..., description="Tag name", examples=["Популярное"], max_length=128)
    first_color: str = Field(..., description="Tag first color", examples=["#000000"], min_length=7, max_length=7)
    second_color: str = Field(..., description="Tag second color", examples=["#FFFFFF"], min_length=7, max_length=7)
    product_id: int = Field(..., description="Product ID", examples=[1], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class TagCreate(TagBase):
    pass

class TagUpdate(TagBase):
    id: int = Field(..., description="Tag ID", examples=[1], ge=0)

class TagRead(TagUpdate):
    created: datetime = Field(..., description="Tag creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Tag update date", examples=["2024/01/01 00:00:00"])