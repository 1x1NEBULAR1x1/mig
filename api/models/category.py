from pydantic import BaseModel, Field
from typing import Sequence
from datetime import datetime
from api.models.product import ProductRead, ProductAvailable
from humps.camel import case

class SubCategoryBase(BaseModel):
    name: str = Field(..., description="SubCategory name", examples=["Игристые вина"], min_length=2, max_length=128)
    image_path: str = Field(..., description="SubCategory image path", examples=["image.png"], min_length=2,
                            max_length=256)
    category_id: int = Field(..., description="Category ID", examples=[1], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class SubCategoryCreate(SubCategoryBase):
    pass

class SubCategoryUpdate(SubCategoryBase):
    id: int = Field(..., description="SubCategory ID", examples=[1], ge=0)

class SubCategoryRead(SubCategoryUpdate):
    created: datetime = Field(..., description="SubCategory creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="SubCategory update date", examples=["2024/01/01 00:00:00"])
    products: Sequence[ProductRead]

class SubCategoryAvailable(SubCategoryRead):
    products: Sequence[ProductAvailable]

class SearchBase(BaseModel):
    name: str = Field(..., description="Category name", examples=["Мебель"], min_length=2, max_length=128)
    category_id: int = Field(..., description="Category ID", examples=[1], ge=0)
    sub_category_id: int = Field(..., description="SubCategory ID", examples=[1], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class SearchCreate(SearchBase):
    pass

class SearchUpdate(SearchBase):
    id: int = Field(..., description="Search ID", examples=[1], ge=0)

class SearchRead(SearchUpdate):
    created: datetime = Field(..., description="Search creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Search update date", examples=["2024/01/01 00:00:00"])

class CategoryBase(BaseModel):
    searches: Sequence['SearchRead']
    name: str = Field(..., description="Category name", examples=["Мебель"], min_length=2, max_length=128)
    image_path: str = Field(..., description="Category image path", examples=["image.png"])

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    id: int = Field(..., description="Category ID", examples=[1], ge=0)

class CategoryRead(CategoryUpdate):
    created: datetime = Field(..., description="Category creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Category update date", examples=["2024/01/01 00:00:00"])
    sub_categories: Sequence[SubCategoryRead]

class CategoryAvailable(CategoryRead):
    sub_categories: Sequence[SubCategoryAvailable]