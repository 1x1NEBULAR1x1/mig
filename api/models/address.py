from pydantic import BaseModel, Field
from typing import Sequence, Optional
from datetime import datetime
from humps.camel import case



class AddressBase(BaseModel):
    city_id: int = Field(..., description="City ID", examples=[1], ge=0)
    street: str = Field(..., description="Street name", examples=["ул. Ленина"], max_length=128)
    house: str = Field(..., description="House number", examples=["12"], max_length=128)
    entrance: str = Field(..., description="House entrance", examples=["1"], max_length=128)
    floor: str = Field(..., description="House floor", examples=["1"], max_length=128)
    flat: str = Field(..., description="House flat", examples=["12"], max_length=128)
    comment: Optional[str] = Field(None, description="House comment", examples=["д. 1"], max_length=128)
    latitude: float = Field(..., description="House latitude", examples=[55.7558], ge=-90, le=90)
    longitude: float = Field(..., description="House longitude", examples=[37.6173], ge=-180, le=180)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True


class BranchAddressBase(AddressBase):
    pass


class BranchAddressCreate(BranchAddressBase):
    pass


class BranchAddressUpdate(BranchAddressBase):
    id: int = Field(..., description="Branch ID", examples=[1], ge=0)


class BranchAddressRead(BranchAddressUpdate):
    created: datetime = Field(..., description="Branch creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Branch update date", examples=["2024/01/01 00:00:00"])


class UserAddressBase(AddressBase):
    pass


class UserAddressCreate(UserAddressBase):
    pass


class UserAddressUpdate(UserAddressBase):
    id: int = Field(..., description="User ID", examples=[1], ge=0)


class UserAddressRead(UserAddressUpdate):
    created: datetime = Field(..., description="User creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="User update date", examples=["2024/01/01 00:00:00"])
