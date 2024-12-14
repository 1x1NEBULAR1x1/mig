from pydantic import BaseModel, Field
from typing import Sequence, Optional
from datetime import datetime
from api.models.product import ProductUpdate, ProductRead
from api.models.address import UserAddressBase
from humps.camel import case

class OrderProductBase(BaseModel):
    product_id: int = Field(..., description="Product ID", examples=[1], ge=0)
    amount: int = Field(..., description="Product amount", examples=[1], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class OrderProductCreate(OrderProductBase):
    pass

class OrderProductUpdate(OrderProductBase):
    order_id: int = Field(..., description="Order ID", examples=[1], ge=0)
    branch_id: int = Field(..., description="Branch ID", examples=[1], ge=0)
    product: 'ProductUpdate'
    id: int = Field(..., description="Order product ID", examples=[1], ge=0)


class OrderProductRead(OrderProductUpdate):
    created: datetime = Field(..., description="Order product creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Order product update date", examples=["2024/01/01 00:00:00"])
    product: ProductRead


class OrderStatusBase(BaseModel):
    name: str = Field(..., description="Order status name", examples=["Начат"], min_length=2, max_length=64)
    full_status: str = Field(..., description="Order status full name", examples=["Поиск курьера"], max_length=128)
    description: str = Field(..., description="Order status description",
                             examples=["Подождите пока курьер ответит на вашу заявку"], max_length=512)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class OrderStatusCreate(OrderStatusBase):
    pass

class OrderStatusUpdate(OrderStatusBase):
    id: int = Field(..., description="Order status ID", examples=[1], ge=0)

class OrderStatusRead(OrderStatusUpdate):
    created: datetime = Field(..., description="Order status creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Order status update date", examples=["2024/01/01 00:00:00"])

class UserUpdate(BaseModel):
    phone_number: int = Field(..., description="User phone number", examples=[1234567890], ge=0)
    city_id: int = Field(..., description="City ID", examples=[1], ge=0)
    is_banned: bool = Field(..., description="User ban status", examples=[False])
    id: int = Field(..., description="User ID", examples=[1], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class OrderBase(BaseModel):
    total_price: float = Field(..., description="Order total price", examples=[100.0], ge=0)
    address: 'UserAddressBase'
    time_to_delivery: Optional[str] = Field(None, description="Order delivery time", examples=["10:00"], max_length=128)
    payment_method: str = Field(..., description="Order payment method", examples=["Перевод на номер телефона"],
                                max_length=128)
    delivery_price: float = Field(..., description="Order delivery price", examples=[100.0], ge=0)
    products: Sequence[OrderProductCreate]
    priority_id: int = Field(..., description='Order priority delivery time id', examples=[1])
    curier_tips: float = Field(0.0, description="Order curier tips", examples=[100.0], ge=0)
    is_payment_accepted: bool = Field(False, description="Order payment status", examples=[False])
    tax: float = Field(0.0, description="Order tax", examples=[100.0], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class OrderCreate(OrderBase):
    pass

class OrderUpdate(OrderBase):
    id: int = Field(..., description="Order ID", examples=[1], ge=0)
    products: Sequence[OrderProductUpdate]

class OrderNoUserRead(OrderUpdate):
    finished: Optional[datetime] = Field(None, description="Order finish date", examples=["2024/01/01 00:00:00"])
    created: datetime = Field(..., description="Order creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Order update date", examples=["2024/01/01 00:00:00"])
    user_id: int = Field(..., description="User ID", examples=[1], ge=0)
    address_id: int = Field(..., description="Address ID", examples=[1], ge=0)
    curier_id: Optional[int] = Field(None, description="Curier ID", examples=[1], ge=0)
    status_id: int = Field(..., description="Order status ID", examples=[1], ge=0)
    status: 'OrderStatusRead'
    products: Sequence[OrderProductRead]

class OrderRead(OrderNoUserRead):
    user: 'UserUpdate'


class CurierBase(BaseModel):
    full_name: str = Field(..., description="Curier full name", examples=["Курьер"], max_length=128)
    username: Optional[str] = Field(None, description="Curier username", examples=["kurier"], max_length=128)
    telegram_id: int = Field(..., description="Curier telegram ID", examples=[1], ge=0)
    phone_number: int = Field(..., description="Curier phone number", examples=[123456789], ge=0)
    city_id: int = Field(..., description="Curier city ID", examples=[1], ge=0)
    is_available: bool = Field(..., description="Curier availability", examples=[True])
    is_banned: bool = Field(..., description="Curier ban status", examples=[False])
    balance: float = Field(..., description="Curier balance", examples=[0.0])

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class CurierUpdate(CurierBase):
    id: int = Field(..., description="Curier ID", examples=[1], ge=0)

class CurierRead(CurierUpdate):
    created: datetime = Field(..., description="Curier creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Curier update date", examples=["2024/01/01 00:00:00"])

    order: 'OrderRead'

class OrderHistoryBase(BaseModel):
    order_id: int = Field(..., description="Order ID", examples=[1], ge=0)
    curier_id: int = Field(..., description="Curier ID", examples=[1], ge=0)

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class OrderHistoryUpdate(OrderHistoryBase):
    id: int = Field(..., description="Order history ID", examples=[1], ge=0)


class OrderHistoryRead(OrderHistoryBase):
    created: datetime = Field(..., description="Order history creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Order history update date", examples=["2024/01/01 00:00:00"])
    curier: 'CurierUpdate'
    order: 'OrderRead'

class OrderPriorityBase(BaseModel):
    name: str = Field(..., description="Order status name", examples=["В ближайшее время (30 - 60 минут)"])
    priority: int = Field(..., description="Order status priority", examples=[1], ge=0)
    extra_cost: float = Field(..., description="Order status extra cost", examples=[0.0])

    class Config:
        from_attributes = True
        alias_generator = case
        populate_by_name = True

class OrderPriorityUpdate(OrderPriorityBase):
    id: int = Field(..., description="Order status ID", examples=[1], ge=0)

class OrderPriorityRead(OrderPriorityUpdate):
    created: datetime = Field(..., description="Order status creation date", examples=["2024/01/01 00:00:00"])
    updated: datetime = Field(..., description="Order status update date", examples=["2024/01/01 00:00:00"])