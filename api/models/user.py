from pydantic import BaseModel, Field
from datetime import datetime
from api.models.address import UserAddressRead
from typing import Sequence, Optional
from api.models.order import OrderNoUserRead
from api.models.city import CityRead
from humps.camel import case

class UserBase(BaseModel):
    phone_number: str = Field(..., description="User phone number", examples=[1234567890])
    city_id: int = Field(..., description="City ID", examples=[1], ge=0)
    is_banned: bool = Field(..., description="User ban status", examples=[False])
    name: Optional[str] = Field(None, description="User name", examples=["John"], max_length=128)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True


class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    id: int = Field(..., description="User ID", examples=[1], ge=0)

class UserRead(UserUpdate):
    created: datetime = Field(..., description="User creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="User update date", examples=["2024/01/01 00:00:00"])
    addresses: Sequence[UserAddressRead]
    orders: Sequence[OrderNoUserRead]
    city: CityRead

class Admin(BaseModel):
    login: str = Field(..., description="Admin username", examples=["admin"], max_length=128)
    hashed_password: str = Field(..., description="Admin password", examples=["123123"], max_length=128)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class AdminRead(Admin):
    id: int = Field(..., description="Admin ID", examples=[1], ge=0)
    username: str = Field(..., description="Admin username", examples=["admin"], max_length=128)
    full_name: str = Field(..., description="Admin full name", examples=["John Doe"], max_length=128)
    telegram_id: int = Field(..., description="Admin telegram ID", examples=[1234567890], ge=0)
    created: datetime = Field(..., description="Admin creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Admin update date", examples=["2024/01/01 00:00:00"])
