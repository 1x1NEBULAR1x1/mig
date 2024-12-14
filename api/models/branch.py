from pydantic import BaseModel, Field
from typing import Sequence, Optional
from datetime import datetime

from api.models.address import BranchAddressCreate
from api.models.product import ProductRead
from api.models.address import BranchAddressRead
from humps.camel import case

class BranchProductBase(BaseModel):
    product_id: int = Field(..., description="Product ID", examples=[1], ge=0)
    branch_id: int = Field(..., description="Branch ID", examples=[1], ge=0)
    amount: int = Field(..., description="Product amount", examples=[1], ge=0)
    is_available: bool = Field(..., description="Product availability", examples=[True])

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True


class BranchProductCreate(BranchProductBase):
    pass


class BranchProductUpdate(BranchProductBase):
    id: int = Field(..., description="Branch product ID", examples=[1], ge=0)


class BranchProductRead(BranchProductUpdate):
    created: datetime = Field(..., description="Branch product creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Branch product update date", examples=["2024/01/01 00:00:00"])
    product: ProductRead

class BranchBase(BaseModel):
    name: str = Field(..., description="Branch name", examples=["Москва Филиал 1"], max_length=256)
    is_available: bool = Field(..., description="Branch availability", examples=[True])
    description: Optional[str] = Field(None, description="Branch description", examples=["Главный филиал"],
                                       max_length=2048)
    address: 'BranchAddressCreate'


    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class BranchCreate(BranchBase):
    pass

class BranchUpdate(BranchBase):
    address_id: int = Field(..., description="Branch address ID", examples=[1], ge=0)
    id: int = Field(..., description="Branch ID", examples=[1], ge=0)

class BranchRead(BranchUpdate):
    created: datetime = Field(..., description="Branch creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Branch update date", examples=["2024/01/01 00:00:00"])
    address: BranchAddressRead
    products: Sequence[BranchProductRead]