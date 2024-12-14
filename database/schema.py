from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from config import DATABASE_URL
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, String, DateTime, Numeric, ForeignKey, Integer
from datetime import datetime

class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, nullable=False)
    updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now,
                                              nullable=False)

class Tax(Base):
    __tablename__ = 'tax'
    tax: Mapped[float] = mapped_column(Numeric(10, 2), unique=True, nullable=False, default=0.0)

class DeliveryPrice(Base):
    __tablename__ = 'delivery_price'
    start_price: Mapped[float] = mapped_column(Numeric(10, 2), unique=True, nullable=False, default=0.0)
    cost_per_100m: Mapped[float] = mapped_column(Numeric(10, 2), unique=True, nullable=False, default=0.0)


class OrderProduct(Base):
    __tablename__ = 'order_products'
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'), nullable=False)
    product: Mapped['Product'] = relationship('Product', lazy='selectin')
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    branch_id: Mapped[int] = mapped_column(ForeignKey('branches.id'), nullable=False)
    branch: Mapped['Branch'] = relationship('Branch', lazy='selectin', back_populates='order_products')
    order_id: Mapped[int] = mapped_column(ForeignKey('orders.id'), nullable=False)
    order: Mapped['Order'] = relationship('Order', back_populates='products')

class Order(Base):
    __tablename__ = 'orders'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False, index=True)
    user: Mapped['User'] = relationship('User', lazy='selectin', back_populates='orders')
    products: Mapped[list['OrderProduct']] = relationship('OrderProduct', back_populates='order',
                                                          lazy='joined')
    address_id: Mapped[int] = mapped_column(ForeignKey('user_addresses.id'), nullable=False)
    address: Mapped['UserAddress'] = relationship('UserAddress', lazy='selectin')
    finished: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    total_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    payment_method: Mapped[str] = mapped_column(String(128), nullable=False)
    delivery_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    curier_id: Mapped[int] = mapped_column(ForeignKey('curiers.id'), nullable=True)
    curier: Mapped['Curier'] = relationship('Curier', back_populates='order', lazy='selectin', uselist=False)
    status_id: Mapped[int] = mapped_column(ForeignKey('order_statuses.id'), nullable=False)
    status: Mapped['OrderStatus'] = relationship('OrderStatus', back_populates='orders', lazy='selectin')
    time_to_delivery: Mapped[str] = mapped_column(String(128), nullable=True)
    priority_id: Mapped[int] = mapped_column(ForeignKey('order_priorities.id'), nullable=False)
    priority: Mapped['OrderPriority'] = relationship('OrderPriority', back_populates='orders', lazy='selectin')
    curier_tips: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    is_payment_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    tax: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)

class Search(Base):
    __tablename__ = 'searches'
    category_id: Mapped[int] = mapped_column(ForeignKey('categories.id'), nullable=False)
    category: Mapped['Category'] = relationship('Category', back_populates='searches')
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    sub_category_id: Mapped[int] = mapped_column(ForeignKey('sub_categories.id'), nullable=False)
    sub_category: Mapped['SubCategory'] = relationship('SubCategory')

class User(Base):
    __tablename__ = 'users'
    is_banned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    phone_number: Mapped[str] = mapped_column(String(32), nullable=False, unique=True, index=True)
    addresses: Mapped[list['UserAddress']] = relationship('UserAddress', back_populates='user',
                                                          lazy='selectin')
    name: Mapped[str] = mapped_column(String(128), nullable=True)
    city_id: Mapped[int] = mapped_column(ForeignKey('cities.id'), nullable=False)
    city: Mapped['City'] = relationship('City', back_populates='users', lazy='selectin')
    orders: Mapped[list['Order']] = relationship('Order', back_populates='user', lazy='joined')

class Admin(Base):
    __tablename__ = 'admins'
    telegram_id: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    full_name: Mapped[str] = mapped_column(String(256), nullable=False)
    username: Mapped[str] = mapped_column(String(128), nullable=True, unique=True)
    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)
    login: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)

class City(Base):
    __tablename__ = 'cities'
    name: Mapped[str] = mapped_column(String(128), nullable=False, unique=True, index=True)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    curiers: Mapped[list['Curier']] = relationship('Curier', back_populates='city')
    branches: Mapped[list['Branch']] = relationship('Branch', back_populates='city', lazy='selectin')
    users: Mapped[list['User']] = relationship('User', back_populates='city')

class Branch(Base):
    __tablename__ = 'branches'
    name: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    products: Mapped[list['BranchProduct']] = relationship('BranchProduct', back_populates='branch', lazy='selectin')

    order_products: Mapped[list['OrderProduct']] = relationship('OrderProduct', back_populates='branch', lazy='selectin')

    address_id: Mapped[int] = mapped_column(ForeignKey('branch_addresses.id'), nullable=False)
    address: Mapped['BranchAddress'] = relationship('BranchAddress', back_populates='branch', lazy='joined')

    description: Mapped[str] = mapped_column(String(2048), nullable=True)
    city_id: Mapped[int] = mapped_column(ForeignKey('cities.id'), nullable=False)
    city: Mapped['City'] = relationship('City', back_populates='branches')


class BranchAddress(Base):
    __tablename__ = 'branch_addresses'
    city_id: Mapped[int] = mapped_column(ForeignKey('cities.id'), nullable=False)

    branch: Mapped['Branch'] = relationship('Branch', back_populates='address', single_parent=True)

    street: Mapped[str] = mapped_column(String(128), nullable=False)
    house: Mapped[str] = mapped_column(String(128), nullable=False)
    floor: Mapped[str] = mapped_column(String(128), nullable=False)
    flat: Mapped[str] = mapped_column(String(128), nullable=False)
    comment: Mapped[str] = mapped_column(String(2048), nullable=True)
    entrance: Mapped[str] = mapped_column(String(128), nullable=True)
    latitude: Mapped[float] = mapped_column(Numeric(10, 6), nullable=False)
    longitude: Mapped[float] = mapped_column(Numeric(10, 6), nullable=False)

class BranchProduct(Base):
    __tablename__ = 'branch_products'
    branch_id: Mapped[int] = mapped_column(ForeignKey('branches.id'), nullable=False)
    branch: Mapped['Branch'] = relationship('Branch', back_populates='products', lazy='selectin')
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'), nullable=False, index=True)
    product: Mapped['Product'] = relationship('Product', back_populates='branch_products', lazy='selectin')
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)

class UserAddress(Base):
    __tablename__ = 'user_addresses'
    city_id: Mapped[int] = mapped_column(ForeignKey('cities.id'), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    user: Mapped['User'] = relationship('User', back_populates='addresses')
    street: Mapped[str] = mapped_column(String(128), nullable=False)
    house: Mapped[str] = mapped_column(String(128), nullable=False)
    floor: Mapped[str] = mapped_column(String(128), nullable=False)
    flat: Mapped[str] = mapped_column(String(128), nullable=False)
    comment: Mapped[str] = mapped_column(String(2048), nullable=True)
    entrance: Mapped[str] = mapped_column(String(128), nullable=True)
    latitude: Mapped[float] = mapped_column(Numeric(10, 6), nullable=False)
    longitude: Mapped[float] = mapped_column(Numeric(10, 6), nullable=False)

class Category(Base):
    __tablename__ = 'categories'
    image_path: Mapped[str] = mapped_column(String(256), nullable=False)
    searches: Mapped[list['Search']] = relationship('Search', back_populates='category', lazy='joined')
    name: Mapped[str] = mapped_column(String(128), nullable=False, unique=True, index=True)
    sub_categories: Mapped[list['SubCategory']] = relationship('SubCategory', back_populates='category',
                                                               lazy='selectin')

class SubCategory(Base):
    __tablename__ = 'sub_categories'
    name: Mapped[str] = mapped_column(String(128), nullable=False, unique=True, index=True)
    category_id: Mapped[int] = mapped_column(ForeignKey('categories.id'), nullable=False)
    category: Mapped['Category'] = relationship('Category', back_populates='sub_categories')
    products: Mapped[list['Product']] = relationship('Product', back_populates='sub_category', lazy='selectin')
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    image_path: Mapped[str] = mapped_column(String(256), nullable=False)


class Product(Base):
    __tablename__ = 'products'
    name: Mapped[str] = mapped_column(String(256), nullable=False, unique=True, index=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(10, 3), nullable=False)
    units_of_measure: Mapped[str] = mapped_column(String(16), nullable=True)
    previous_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    description: Mapped[str] = mapped_column(String(2048), nullable=False)
    image_path: Mapped[str] = mapped_column(String(256), nullable=False)
    compound: Mapped[str] = mapped_column(String(2048), nullable=True)
    expiration: Mapped[str] = mapped_column(String(256), nullable=False)
    storage: Mapped[str] = mapped_column(String(256), nullable=True)
    manufacturer: Mapped[str] = mapped_column(String(256), nullable=False)
    tags: Mapped[list['Tag']] = relationship('Tag', back_populates='product', lazy='selectin')
    contains: Mapped[list['ProductContains']] = relationship('ProductContains', back_populates='product',
                                                             lazy='selectin')
    sub_category_id: Mapped[int] = mapped_column(ForeignKey('sub_categories.id'), nullable=False)
    sub_category: Mapped['SubCategory'] = relationship('SubCategory', back_populates='products')
    branch_products: Mapped[list['BranchProduct']] = relationship('BranchProduct', back_populates='product',
                                                                  lazy='selectin')

class Tag(Base):
    __tablename__ = 'tags'
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    first_color: Mapped[str] = mapped_column(String(8), nullable=False)
    second_color: Mapped[str] = mapped_column(String(8), nullable=False)
    product: Mapped['Product'] = relationship('Product', back_populates='tags')

class ProductContains(Base):
    __tablename__ = 'product_contains'
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'), nullable=False)
    product: Mapped['Product'] = relationship('Product', back_populates='contains')
    amount: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(64), nullable=False)

class OrderStatus(Base):
    __tablename__ = 'order_statuses'
    name: Mapped[str] = mapped_column(String(64), nullable=False, unique=False)
    full_status: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(String(512), nullable=False)
    orders: Mapped[list['Order']] = relationship('Order', back_populates='status')


class Curier(Base):
    __tablename__ = 'curiers'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(128), nullable=False)
    username: Mapped[str] = mapped_column(String(128), nullable=True, unique=True)
    telegram_id: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    phone_number: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    balance: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_banned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    city_id: Mapped[int] = mapped_column(ForeignKey('cities.id'), nullable=False)
    city: Mapped['City'] = relationship('City', back_populates='curiers')
    order: Mapped['Order'] = relationship('Order', back_populates='curier', uselist=False, lazy='selectin')

class Request(Base):
    __tablename__ = 'requests'
    telegram_id: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    city_id: Mapped[int] = mapped_column(ForeignKey('cities.id'), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    is_accepted: Mapped[bool] = mapped_column(Boolean, nullable=True, default=None)
    username: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)

class OrderHistory(Base):
    __tablename__ = 'curier_order_history'
    curier_id: Mapped[int] = mapped_column(ForeignKey('curiers.id'), nullable=True)
    curier: Mapped['Curier'] = relationship('Curier')
    order_id: Mapped[int] = mapped_column(ForeignKey('orders.id'), nullable=False)
    order: Mapped['Order'] = relationship('Order')

class Code(Base):
    __tablename__ = 'codes'
    code: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    expiration: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(16), nullable=False)
    is_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

class OrderPriority(Base):
    __tablename__ = 'order_priorities'
    name: Mapped[str] = mapped_column(String(512), nullable=False, unique=True)
    priority: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    orders: Mapped[list['Order']] = relationship('Order', back_populates='priority')
    extra_cost: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.00)