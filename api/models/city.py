from pydantic import BaseModel, Field
from typing import Sequence
from datetime import datetime
from api.models.branch import BranchRead
from humps.camel import case

class City(BaseModel):
    name: str = Field(..., description="City name", examples=["Москва"], min_length=2, max_length=128)
    is_available: bool = Field(True, description="City availability", examples=[True])

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class CityCreate(City):
    pass

class CityUpdate(City):
    id: int = Field(..., description="City ID", examples=[1], ge=0)

class CityRead(CityUpdate):
    created: datetime = Field(..., description="City creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="City update date", examples=["2024/01/01 00:00:00"])
    branches: Sequence[BranchRead]