from pydantic import BaseModel, Field
from typing import Sequence, Optional
from datetime import datetime
from api.models.tag import TagRead
from humps.camel import case

class ProductContains(BaseModel):
    name: str = Field(..., description="Product name", examples=["Углеводы"], max_length=64)
    amount: str = Field(..., description="Product amount", examples=["16 г"], max_length=64)
    product_id: int = Field(..., description="Product ID", examples=[1], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class ProductContainsCreate(ProductContains):
    pass

class ProductContainsUpdate(ProductContains):
    id: int = Field(..., description="Product ID", examples=[1], ge=0)

class ProductContainsRead(ProductContainsUpdate):
    created: datetime = Field(..., description="Product creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Product update date", examples=["2024/01/01 00:00:00"])

class ProductBase(BaseModel):
    name: str = Field(..., description="Product name", examples=["Вино романовское"], max_length=256)
    price: float = Field(..., description="Product price", examples=[1000], ge=0)
    image_path: str = Field(..., description="Product image path", examples=["image.png"], max_length=256)
    sub_category_id: int = Field(..., description="SubCategory ID", examples=[1], ge=0)
    is_available: bool = Field(..., description="Product availability", examples=[True])
    description: Optional[str] = Field(None, description="Product description",
                                       examples=["Красное полусладкое вино"], max_length=2048)
    amount: float = Field(..., description="Product amount", examples=[750], ge=0)
    units_of_measure: Optional[str] = Field(None, description="Product unit of measure", examples=["мл"], max_length=16)
    compound: Optional[str] = Field(None, description="Product compound", examples=["Вода, сахар"], max_length=2048)
    expiration: Optional[str] = Field(None, description="Product expiration date", examples=["2024/01/01 00:00:00"])
    storage: Optional[str] = Field(None, description="Product storage conditions",
                                   examples=["Хранить в сухом месте от +5 до +25С"], max_length=256)
    manufacturer: str = Field(None, description="Product manufacturer", examples=["ООО Вина Роман"], max_length=256)
    previous_price: Optional[float] = Field(None, description="Product previous price", examples=[1000], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    id: int = Field(..., description="Product ID", examples=[1], ge=0)

class ProductRead(ProductUpdate):
    created: datetime = Field(..., description="Product creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Product update date", examples=["2024/01/01 00:00:00"])
    contains: Optional[Sequence[ProductContainsRead]]
    tags: Optional[Sequence[TagRead]]

class ProductAvailable(ProductRead):
    available_amount: float = Field(..., description="Product available amount", examples=[750], ge=0)
