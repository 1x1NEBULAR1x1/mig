from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine, async_sessionmaker
from typing import AsyncGenerator
from database.schema import *
from sqlalchemy import select, or_, update, func, and_, delete
from sqlalchemy.orm import joinedload, aliased, selectinload
from typing import Sequence
from enum import Enum
from datetime import timedelta, datetime
from config import DATABASE_URL


class Database:
    def __init__(self):
        self.engine: AsyncEngine = create_async_engine(DATABASE_URL)
        self.ssn = async_sessionmaker(self.engine, expire_on_commit=False)

    async def create_db_and_tables(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    # Tax
    async def add_tax(self, tax: float) -> Tax:
        async with self.ssn() as ssn:
            tax_ = await ssn.scalar(select(Tax))
            if not tax_:
                tax_ = Tax(tax=tax, id=1)
                ssn.add(tax_)
                await ssn.commit()
                await ssn.flush()
                await ssn.refresh(tax_)
            return tax_

    async def get_codes(self):
        async with self.ssn() as ssn:
            return (await ssn.scalars(select(Code))).all()

    async def update_tax(self, tax: float) -> Tax:
        async with self.ssn() as ssn:
            await ssn.execute(update(Tax).values(tax=tax))
            await ssn.commit()
            return await ssn.scalar(select(Tax))

    async def get_tax(self) -> Tax:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(Tax))
    # Tax

    # DeliveryPrice
    async def add_delivery_price(self, start_price: float, cost_per_100m: float) -> DeliveryPrice:
        async with self.ssn() as ssn:
            delivery_price = await ssn.scalar(select(DeliveryPrice))
            if not delivery_price:
                delivery_price = DeliveryPrice(start_price=start_price, cost_per_100m=cost_per_100m, id=1)
                ssn.add(delivery_price)
                await ssn.commit()
                await ssn.flush()
                await ssn.refresh(delivery_price)
            return delivery_price

    async def update_delivery_price(self, start_price: float, cost_per_100m: float) -> DeliveryPrice:
        async with self.ssn() as ssn:
            await ssn.execute(update(DeliveryPrice).values(start_price=start_price, cost_per_100m=cost_per_100m))
            await ssn.commit()
            return await ssn.scalar(select(DeliveryPrice))

    async def get_delivery_price(self) -> DeliveryPrice:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(DeliveryPrice))
    # DeliveryPrice

    # Requests
    async def add_request(self, phone_number: str, telegram_id: int, name: str, city_id: int, username: str) -> Request:
        async with self.ssn() as ssn:
            request = Request(
                phone_number=phone_number,
                name=name,
                telegram_id=telegram_id,
                city_id=city_id,
                username=username
            )
            ssn.add(request)
            await ssn.flush()
            await ssn.commit()
            await ssn.refresh(request)
            return request

    async def get_request(self, id: int = None, telegram_id: int = None) -> Request | None:
        async with self.ssn() as ssn:
            query = select(Request)
            if id is not None:
                query = query.where(Request.id == id)
            if telegram_id is not None:
                query = query.where(Request.telegram_id == telegram_id)
            return await ssn.scalar(query)

    async def delete_request(self, id: int):
        async with self.ssn() as ssn:
            query = delete(Request).where(Request.id == id)
            await ssn.execute(query)
            await ssn.commit()

    async def update_request(self, id: int, is_accepted: bool):
        async with self.ssn() as ssn:
            query = update(Request).where(Request.id == id).values(is_accepted=is_accepted)
            await ssn.execute(query)
            await ssn.commit()
    # Requests

    # Priority
    async def add_order_priority(
            self,
            name: str,
            priority: int,
            extra_cost: float
    ) -> OrderPriority | None:
        async with self.ssn() as ssn:
            order_priority = OrderPriority(name=name, priority=priority, extra_cost=extra_cost)
            ssn.add(order_priority)
            await ssn.flush()
            await ssn.commit()
            await ssn.refresh(order_priority)
            return order_priority

    async def update_order_priority(
        self,
        id: int,
        name: str = None,
        priority: int = None,
        extra_cost: float = None
    ) -> OrderPriority:
        async with self.ssn() as ssn:
            order_priority = await ssn.scalar(select(OrderPriority).where(OrderPriority.id == id))
            if order_priority is not None:
                if name is None:
                    name = order_priority.name
                if priority is None:
                    priority = order_priority.priority
                if extra_cost is None:
                    extra_cost = order_priority.extra_cost
                await ssn.execute(update(OrderPriority).where(OrderPriority.id == user.id).values(name=name, priority=priority, extra_cost=extra_cost))
                await ssn.flush()
                await ssn.refresh(order_priority)
                await ssn.commit()
            return order_priority

    async def get_order_priorities(
            self
    ) -> list[OrderPriority]:
        async with self.ssn() as ssn:
            query = select(OrderPriority)
            return await ssn.scalars(query)

    # Code
    async def add_code(self, phone_number: str, code: int, expiration: timedelta):
        async with self.ssn() as ssn:
            code = Code(phone_number=phone_number, code=code, expiration=datetime.now() + expiration)
            ssn.add(code)
            await ssn.flush()
            await ssn.commit()
            await ssn.refresh(code)
            return code

    async def use_code(self, phone_number: str, code: int) -> bool:
        async with self.ssn() as ssn:
            query = select(Code).where(Code.phone_number == phone_number, Code.code == code,
                                       Code.expiration > datetime.now(), Code.is_used.is_not(True))
            code = await ssn.scalar(query)
            if code is not None:
                await ssn.execute(update(Code).where(Code.id == code.id).values(is_used=True))
                await ssn.commit()
                return True
            return False
    # Code

    # User
    async def get_user(self, id: int = None, phone_number: str = None, user_address_id: int = None) -> User | None:
        async with self.ssn() as ssn:
            query = select(User)
            if id is not None:
                query = query.where(User.id == id)
            if phone_number is not None:
                query = query.where(User.phone_number == phone_number)
            if user_address_id is not None:
                query = query.where(User.addresses.any(Address.id == user_address_id))
            return (await ssn.scalars(query)).first()

    async def get_users(self, city_id: int = None) -> Sequence[User]:
        async with self.ssn() as ssn:
            query = select(User)
            if city_id is not None:
                query = query.where(User.city_id == city_id)
            return (await ssn.scalars(query)).unique().all()

    async def add_user(self, phone_number: int, city_id: int) -> User:
        async with self.ssn() as ssn:
            user = await ssn.scalar(select(User).where(User.phone_number == phone_number))
            if not user:
                user = User(phone_number=phone_number, city_id=city_id)
                ssn.add(user)
                await ssn.flush()
                await ssn.commit()
                await ssn.refresh(user)
            return user

    async def update_user(
        self,
        id: int,
        is_banned: bool = None,
        name: str = None,
    ) -> User | None:
        async with self.ssn() as ssn:
            user = await ssn.scalar(select(User).where(User.id == id))
            if user is not None:
                if name is None:
                    name = user.name
                await ssn.execute(update(User).where(User.id == user.id).values(is_banned=is_banned, name=name))
                await ssn.flush()
                await ssn.refresh(user)
                await ssn.commit()
            return user
    # User

    # City
    async def add_city(self, name: str, is_available: bool = True) -> City | None:
        async with self.ssn() as ssn:
            city = await ssn.scalar(select(City).where(City.name == name))
            if not city:
                city = City(name=name, is_available=is_available)
                ssn.add(city)
                await ssn.flush()
                await ssn.commit()
                await ssn.refresh(city)
            return city

    async def update_city(self, id: int, name: str = None, is_available: bool = None) -> City | None:
        async with self.ssn() as ssn:
            city = await ssn.scalar(select(City).where(City.id == id))
            if city is not None:
                if is_available is None:
                    is_available = city.is_available
                if name is None:
                    name = city.name
                await ssn.execute(update(City).where(City.id == city.id).values(is_available=is_available, name=name))
                await ssn.flush()
                await ssn.refresh(city)
                await ssn.commit()
            return city

    async def get_city(self, id: int = None, name: str = None) -> City | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(City).where(or_(City.id == id, City.name == name)))

    async def get_cities(
        self,
        is_available: bool = None,
        page: int = None,
        limit: int = 25
    ) -> Sequence[City]:
        async with self.ssn() as ssn:
            query = select(City)
            if page is not None:
                query = query.offset(page * limit).limit((page + 1) * limit)
            if is_available is not None:
                query = query.where(City.is_available == is_available)
            return (await ssn.scalars(query)).all()
    # City

    # Branch
    async def add_branch(
        self,
        name: str,
        city_id: int,
        address_id: int,
        description: str = None,
        is_available: bool = True
    ) -> Branch | None:
        async with self.ssn() as ssn:
            branch = await ssn.scalar(select(Branch).where(or_(Branch.name == name, Branch.address_id == address_id)))
            if not branch:
                branch = Branch(name=name, city_id=city_id, address_id=address_id, description=description, is_available=is_available)
                ssn.add(branch)
                await ssn.flush()
                await ssn.commit()
                await ssn.refresh(branch)
            return branch

    async def update_branch(
            self,
            id: int,
            is_available: bool = None,
            address_id: int = None,
            description: str = None,
            name: str = None
    ) -> Branch | None:
        async with self.ssn() as ssn:
            branch = await ssn.scalar(select(Branch).where(Branch.id == id))
            if branch is not None:
                if name is None:
                    name = branch.name
                if description is None:
                    description = branch.description
                if address_id is None:
                    address_id = branch.address_id
                if is_available is None:
                    is_available = branch.is_available
                await ssn.execute(update(Branch).where(Branch.id == branch.id).values(
                    name=name, description=description, address_id=address_id, is_available=is_available))
                await ssn.commit()
                await ssn.flush()
                await ssn.refresh(branch)
            return branch

    async def get_branch(self, id: int = None, name: str = None, address_id: int = None) -> Branch | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(Branch).where(or_(Branch.id == id, Branch.name == name,
                                                             Branch.address_id == address_id)))

    async def get_branch_by_product_id(
            self,
            product_id: int,
            amount: int,
            city_id: int
    ) -> Branch | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(
                select(Branch)
                .join(Branch.products)
                .where(
                    BranchProduct.product_id == product_id,
                    BranchProduct.amount >= amount,
                    Branch.city_id == city_id
                )
            )

    async def get_branches(
            self,
            city_id: int = None,
            is_available: bool = None,
    ) -> Sequence[Branch]:
        async with self.ssn() as ssn:
            query = select(Branch)
            if city_id is not None:
                query = query.where(Branch.city_id == city_id)
            if is_available is not None:
                query = query.where(Branch.is_available == is_available)
            return (await ssn.scalars(query)).all()
    # Branch

    # BranchProduct
    async def add_branch_product(
            self,
            branch_id: int,
            product_id: int,
            amount: int,
            is_available: bool = None
    ) -> BranchProduct | None:
        async with self.ssn() as ssn:
            product = await ssn.scalar(select(BranchProduct).where(BranchProduct.branch_id == branch_id)
                                       .where(BranchProduct.product_id == product_id))
            if not product:
                product = BranchProduct(
                    branch_id=branch_id,
                    product_id=product_id,
                    amount=amount,
                    is_available=is_available
                )
                ssn.add(product)
                await ssn.flush()
                await ssn.commit()
                await ssn.refresh(product)
            return product

    async def update_branch_product(
            self,
            id: int,
            amount: int = None,
            is_available: bool = None
    ) -> BranchProduct | None:
        async with self.ssn() as ssn:
            product = await ssn.scalar(select(BranchProduct).where(BranchProduct.id == id))
            if product is not None:
                if amount is None:
                    amount = product.amount
                if is_available is None:
                    is_available = product.is_available
                await ssn.execute(update(BranchProduct).where(BranchProduct.id == product.id).values(
                    amount=amount, is_available=is_available))
                await ssn.flush()
                await ssn.refresh(product)
                await ssn.commit()
            return product

    async def get_branch_product(
            self,
            id: int = None,
            branch_id: int = None,
            product_id: int = None
    ) -> BranchProduct | None:
        async with self.ssn() as ssn:
            if id is not None:
                return await ssn.scalar(select(BranchProduct).where(BranchProduct.id == id))
            if branch_id is not None and product_id is not None:
                return await ssn.scalar(select(BranchProduct).where(BranchProduct.branch_id == branch_id)
                                        .where(BranchProduct.product_id == product_id))

    async def get_branch_products(
            self,
            branch_id: int = None,
            is_available: bool = None,
            product_id: int = None,
            city_id: int = None,
            amount: int = None
    ) -> Sequence[BranchProduct]:
        async with self.ssn() as ssn:
            query = select(BranchProduct)
            if amount is not None:
                query = query.where(BranchProduct.amount >= amount)
            if is_available is not None:
                query = query.where(BranchProduct.is_available == is_available)
            if branch_id is not None:
                query = query.where(BranchProduct.branch_id == branch_id)
            if product_id is not None:
                query = query.where(BranchProduct.product_id == product_id)
            if city_id is not None:
                query = query.where(BranchProduct.city_id == city_id)
            return (await ssn.scalars(query)).all()

    async def get_branch_by_product(
            self,
            product_id: int,
            city_id: int,
            amount: int,
    ) -> Branch | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(
                select(Branch)
                .join(BranchProduct, BranchProduct.branch_id == Branch.id)
                .where(BranchProduct.product_id == product_id)
                .where(Branch.city_id == city_id)
                .where(BranchProduct.amount >= amount)
                .where(BranchProduct.is_available)
            )

    async def delete_branch_product(self, id: int) -> bool:
        async with self.ssn() as ssn:
            try:
                await ssn.execute(delete(BranchProduct).where(BranchProduct.id == id))
                await ssn.commit()
                return True
            except Exception:
                return False

    # BranchProduct

    # Product
    async def add_product(
            self,
            name: str,
            description: str,
            price: float,
            image_path: str,
            sub_category_id: int,
            amount: int,
            compound: str,
            units_of_measure: str,
            expiration: str,
            is_available: bool = None,
            storage: str | None = None,
            manufacturer: str | None = None,
            previous_price: float | None = None,
    ) -> Product | None:
        async with self.ssn() as ssn:
            product = Product(
                name=name,
                description=description,
                price=price,
                image_path=image_path,
                sub_category_id=sub_category_id,
                amount=amount,
                compound=compound,
                units_of_measure=units_of_measure,
                expiration=expiration,
                is_available=is_available,
                storage=storage,
                manufacturer=manufacturer,
                previous_price=previous_price
            )
            ssn.add(product)
            await ssn.flush()
            await ssn.commit()
            await ssn.refresh(product)
            return product

    async def update_product(
            self,
            id: int,
            name: str = None,
            description: str = None,
            price: float = None,
            image_path: str = None,
            sub_category_id: int = None,
            amount: int = None,
            compound: str = None,
            units_of_measure: str = None,
            expiration: str = None,
            is_available: bool = None,
            storage: str = None,
            manufacturer: str = None,
            previous_price: float = None,
    ) -> Product | None:
        async with self.ssn() as ssn:
            product = await ssn.scalar(select(Product).where(Product.id == id))
            if product is not None:
                if name is None:
                    name = product.name
                if description is None:
                    description = product.description
                if price is None:
                    price = product.price
                if image_path is None:
                    image_path = product.image_path
                if sub_category_id is None:
                    sub_category_id = product.sub_category_id
                if amount is None:
                    amount = product.amount
                if compound is None:
                    compound = product.compound
                if units_of_measure is None:
                    units_of_measure = product.units_of_measure
                if expiration is None:
                    expiration = product.expiration
                if is_available is None:
                    is_available = product.is_available
                if storage is None:
                    storage = product.storage
                if manufacturer is None:
                    manufacturer = product.manufacturer
                await ssn.execute(update(Product).where(Product.id == product.id).values(
                    name=name, description=description, price=price, image_path=image_path,
                    sub_category_id=sub_category_id, amount=amount, compound=compound,
                    units_of_measure=units_of_measure, expiration=expiration, is_available=is_available,
                    storage=storage, manufacturer=manufacturer, previous_price=previous_price
                ))
                await ssn.commit()
                await ssn.flush()
                await ssn.refresh(product)
            return product

    async def get_product(self, id: int) -> Product | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(Product).where(Product.id == id))

    async def get_products(
            self,
            category_id: int = None,
            sub_category_id: int = None,
            is_available: bool = None
    ) -> Sequence[Product]:
        async with self.ssn() as ssn:
            query = select(Product)
            if category_id is not None:
                query = query.where(Product.category_id == category_id)
            if sub_category_id is not None:
                query = query.where(Product.sub_category_id == sub_category_id)
            if is_available is not None:
                query = query.where(Product.is_available == is_available)
            return (await ssn.scalars(query)).all()
    # Product

    # OrderProduct
    async def add_order_product(
            self,
            order_id: int,
            product_id: int,
            branch_id: int,
            amount: int
    ) -> OrderProduct:
        async with self.ssn() as ssn:
            order_product = OrderProduct(
                order_id=order_id,
                product_id=product_id,
                branch_id=branch_id,
                amount=amount
            )
            ssn.add(order_product)
            await ssn.commit()
            await ssn.flush()
            await ssn.refresh(order_product)
            return order_product

    async def get_order_products(self, order_id: int) -> Sequence[OrderProduct]:
        async with self.ssn() as ssn:
            return (await ssn.scalars(select(OrderProduct).where(OrderProduct.order_id == order_id))).all()

    async def get_order_product(
            self,
            order_id: int = None,
            product_id: int = None,
            branch_id: int = None,
            id: int = None
    ) -> OrderProduct | None:
        async with self.ssn() as ssn:
            if id is not None:
                return await ssn.scalar(select(OrderProduct).where(OrderProduct.id == id))
            if order_id is not None and product_id is not None and branch_id is not None:
                return await ssn.scalar(select(OrderProduct).where(OrderProduct.order_id == order_id)
                                        .where(OrderProduct.product_id == product_id)
                                        .where(OrderProduct.branch_id == branch_id))
    # OrderProduct

    # Order
    async def add_order(
            self,
            user_id: int,
            address_id: int,
            payment_method: str,
            delivery_price: float,
            status_id: int,
            priority_id: int,
            curier_tips: float = 0.0,
            total_price: float = 0.0,
            curier_id: int = None,
            finished: datetime = None,
            tax: float = 0.0
    ) -> Order | None:
        async with self.ssn() as ssn:
            order = Order(
                user_id=user_id,
                address_id=address_id,
                total_price=total_price,
                payment_method=payment_method,
                delivery_price=delivery_price,
                curier_id=curier_id,
                status_id=status_id,
                finished=finished,
                priority_id=priority_id,
                curier_tips=curier_tips,
                tax=tax
            )
            ssn.add(order)
            await ssn.commit()
            await ssn.flush()
            await ssn.refresh(order)
            return order

    async def get_order(self, id: int) -> Order | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(Order).where(Order.id == id).options(selectinload(Order.user)))

    async def update_order(
            self,
            id: int,
            finished: datetime = None,
            curier_id: int = None,
            status_id: int = None,
            total_price: float = None,
            priority_id: int = None,
            delivery_price: float = None,
            time_to_delivery: str = None,
            is_payment_accepted: bool = None,
            tax: float = None
    ) -> Order | None:
        async with self.ssn() as ssn:
            order = await ssn.scalar(select(Order).where(Order.id == id))
            if order is not None:
                if curier_id == -1:
                    curier_id = None
                if tax is None:
                    tax = order.tax
                elif curier_id is None:
                    curier_id = order.curier_id
                if priority_id is None:
                    priority_id = order.priority_id
                if delivery_price is None:
                    delivery_price = order.delivery_price
                if time_to_delivery is None:
                    time_to_delivery = order.time_to_delivery
                if status_id is None:
                    status_id = order.status_id
                if finished is None:
                    finished = order.finished
                if total_price is None:
                    total_price = order.total_price
                if is_payment_accepted is None:
                    is_payment_accepted = order.is_payment_accepted
                await ssn.execute(
                    update(Order)
                    .where(Order.id == id)
                    .values(
                        curier_id=curier_id,
                        status_id=status_id,
                        finished=finished,
                        total_price=total_price,
                        priority_id=priority_id,
                        delivery_price=delivery_price,
                        time_to_delivery=str(time_to_delivery),
                        is_payment_accepted=is_payment_accepted,
                        tax=tax
                    )
                )
                await ssn.flush()
                await ssn.commit()
                await ssn.refresh(order)
                return order

    async def get_orders(
            self,
            page: int = 0,
            sorting: str = 'newest',
            limit: int = None,
            user_id: int = None,
            status_id: int = None,
            timedelta: timedelta = None,
            curier_id: int = None,
            branch_id: int = None,
            statuses_ids: list[int] = None,
            not_status_ids: list[int] = None,
            is_payment_accepted: bool = None,
            city_id: int = None
    ) -> Sequence[Order]:
        async with self.ssn() as ssn:
            query = select(Order).options(selectinload(Order.user))
            if not_status_ids is not None:
                query = query.where(Order.status_id.not_in(not_status_ids))
            if statuses_ids is not None:
                query = query.where(Order.status_id.in_(statuses_ids))
            if is_payment_accepted is not None:
                query = query.where(Order.is_payment_accepted == is_payment_accepted)
            if sorting == 'newest':
                query = query.order_by(Order.id.desc())
            else:
                query = query.order_by(Order.id.asc())
            if city_id is not None:
                query = query.join(UserAddress).where(UserAddress.city_id == city_id)
            if page > 0:
                if limit is None:
                    limit = 25
                query = query.offset(page * limit).limit((page + 1) * limit)
            if user_id is not None:
                query = query.where(Order.user_id == user_id)
            if status_id is not None:
                query = query.where(Order.status_id == status_id)
            if timedelta is not None:
                query = query.where(Order.created > datetime.now() - timedelta)
            if curier_id is not None:
                query = query.where(Order.curier_id == curier_id)
            if branch_id is not None:
                query = query.where(Order.branch_id == branch_id)
            return (await ssn.scalars(query)).unique().all()
    # Order

    # OrderStatus
    async def add_order_status(
            self, name: str,
            full_status: str,
            description: str
    ) -> OrderStatus | None:
        async with self.ssn() as ssn:
            order_status = OrderStatus(
                name=name,
                full_status=full_status,
                description=description
            )
            ssn.add(order_status)
            await ssn.commit()
            await ssn.flush()
            await ssn.refresh(order_status)
            return order_status

    async def update_order_status(
            self,
            id: int,
            name: str = None,
            full_status: str = None,
            description: str = None
    ) -> OrderStatus | None:
        async with self.ssn() as ssn:
            order_status = await ssn.scalar(select(OrderStatus).where(OrderStatus.id == id))
            if order_status is not None:
                if name is None:
                    name = order_status.name
                if full_status is None:
                    full_status = order_status.full_status
                if description is None:
                    description = order_status.description
                await ssn.execute(
                    update(OrderStatus)
                    .where(OrderStatus.id == id)
                    .values(
                        name=name,
                        full_status=full_status,
                        description=description
                    )
                )
                await ssn.flush()
                await ssn.refresh(order_status)
                return order_status

    async def get_order_status(self, id: int) -> OrderStatus | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(OrderStatus).where(OrderStatus.id == id))

    async def get_order_statuses(self) -> OrderStatus | None:
        async with self.ssn() as ssn:
            return (await ssn.scalars(select(OrderStatus))).all()
    # OrderStatus

    # Curier
    async def add_curier(
            self,
            full_name: str,
            telegram_id: int,
            phone_number: int,
            city_id: int,
            username: str = None
    ) -> Curier | None:
        async with self.ssn() as ssn:
            curier = await ssn.scalar(select(Curier).where(Curier.telegram_id == telegram_id))
            if curier is None:
                curier = Curier(
                    full_name=full_name,
                    telegram_id=telegram_id,
                    username=username,
                    phone_number=phone_number,
                    city_id=city_id
                )
                ssn.add(curier)
                await ssn.flush()
                await ssn.refresh(curier)
                await ssn.commit()
            return curier

    async def get_curier(
            self,
            id: int = None,
            username: str = None,
            telegram_id: int = None,
            phone_number: int = None,
            full_name: str = None,
    ) -> Curier | None:
        async with self.ssn() as ssn:
            query = select(Curier)
            if id is not None:
                query = query.where(Curier.id == id)
            if username is not None:
                query = query.where(Curier.username == username)
            if telegram_id is not None:
                query = query.where(Curier.telegram_id == telegram_id)
            if phone_number is not None:
                query = query.where(Curier.phone_number == phone_number)
            if full_name is not None:
                query = query.where(Curier.full_name == full_name)
            return await ssn.scalar(query)

    async def update_curier(
            self,
            id: int,
            full_name: str = None,
            username: str = None,
            telegram_id: int = None,
            phone_number: int = None,
            city_id: int = None,
            order_id: int = None,
            balance: float = None,
            is_available: bool = None,
            is_banned: bool = None
    ) -> Curier | None:
        async with self.ssn() as ssn:
            curier = await ssn.scalar(select(Curier).where(Curier.id == id))
            if curier is not None:
                if full_name is None:
                    full_name = curier.full_name
                if username is None:
                    username = curier.username
                if telegram_id is None:
                    telegram_id = curier.telegram_id
                if phone_number is None:
                    phone_number = curier.phone_number
                if city_id is None:
                    city_id = curier.city_id
                if balance is None:
                    balance = curier.balance
                if is_available is None:
                    is_available = curier.is_available
                if is_banned is None:
                    is_banned = curier.is_banned
                await ssn.execute(update(Curier).where(Curier.id == id).values(
                    full_name=full_name, username=username, telegram_id=telegram_id, phone_number=phone_number,
                    city_id=city_id, balance=balance, is_available=is_available, is_banned=is_banned
                ))
                await ssn.flush()
                await ssn.refresh(curier)
                await ssn.commit()
            return curier

    async def get_curiers(
            self,
            city_id: int = None,
            is_available: int = None,
            is_banned: int = False
    ) -> Curier | None:
        async with self.ssn() as ssn:
            query = select(Curier)
            if city_id is not None:
                query = query.where(Curier.city_id == city_id)
            if is_available is not None:
                query = query.where(Curier.is_available == is_available)
            if is_banned is not None:
                query = query.where(Curier.is_banned == is_banned)
            return (await ssn.scalars(query)).all()
    # Curier

    # OrderHistory
    async def add_order_history(
            self,
            curier_id: int,
            order_id: int
    ) -> OrderHistory | None:
        async with self.ssn() as ssn:
            order_history = OrderHistory(
                curier_id=curier_id,
                order_id=order_id
            )
            ssn.add(order_history)
            await ssn.flush()
            await ssn.refresh(order_history)
            await ssn.commit()
            return order_history

    async def get_order_histories(
            self,
            id: int = None,
            curier_id: int = None
    ) -> Sequence[OrderHistory] | None:
        async with self.ssn() as ssn:
            query = select(OrderHistory)
            if id is not None:
                query = query.where(OrderHistory.id == id)
            if curier_id is not None:
                query = query.where(OrderHistory.curier_id == curier_id)
            return (await ssn.scalars(query)).all()

    async def get_order_history(
            self,
            id: int = None,
            order_id: int = None
    ) -> OrderHistory | None:
        async with self.ssn() as ssn:
            query = select(OrderHistory)
            if id is not None:
                query = query.where(OrderHistory.id == id)
            if order_id is not None:
                query = query.where(OrderHistory.order_id == order_id)
            return await ssn.scalar(query)
    # OrderHistory

    # Admin
    async def add_admin(
            self,
            telegram_id: int,
            full_name: str,
            username: str = None
    ):
        async with self.ssn() as ssn:
            admin = Admin(
                telegram_id=telegram_id,
                full_name=full_name,
                username=username
            )
            ssn.add(admin)
            await ssn.flush()
            await ssn.refresh(admin)
            await ssn.commit()
            return admin

    async def login_admin(
            self,
            login: str,
            password: str
    ) -> Admin | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(Admin).where(Admin.login == login, Admin.hashed_password == password))

    async def get_admins(self) -> Sequence[Admin] | None:
        async with self.ssn() as ssn:
            return await ssn.scalars(select(Admin)).all()

    async def get_admin(
            self,
            id: int = None,
            username: str = None,
            telegram_id: int = None
    ) -> Admin | None:
        async with self.ssn() as ssn:
            query = select(Admin)
            if id is not None:
                query = query.where(Admin.id == id)
            if username is not None:
                query = query.where(Admin.username == username)
            if telegram_id is not None:
                query = query.where(Admin.telegram_id == telegram_id)
            return await ssn.scalar(query)
    # Admin

    # UserAddress
    async def add_user_address(
            self,
            user_id: int,
            street: str,
            city_id: int,
            house: str,
            floor: str = None,
            flat: str = None,
            entrance: str = None,
            latitude: float = None,
            longitude: float = None,
            comment: str = None,
    ) -> UserAddress | None:
        async with self.ssn() as ssn:
            user_address = UserAddress(
                user_id=user_id,
                street=street,
                house=house,
                floor=floor,
                flat=flat,
                entrance=entrance,
                latitude=latitude,
                longitude=longitude,
                comment=comment,
                city_id=city_id
            )
            ssn.add(user_address)
            await ssn.flush()
            await ssn.refresh(user_address)
            await ssn.commit()
            return user_address

    async def get_user_addresses(
            self,
            city_id: int = None,
            user_id: int = None
    ) -> Sequence[UserAddress] | None:
        async with self.ssn() as ssn:
            query = select(UserAddress)
            if city_id is not None:
                query = query.where(UserAddress.city_id == city_id)
            if user_id is not None:
                query = query.where(UserAddress.user_id == user_id)
            return (await ssn.scalars(query)).all()

    async def get_user_address(
            self,
            id: int = None,
            user_id: int = None,
            street: str = None,
            city_id: int = None,
            house: str = None,
            flat: str = None,
            entrance: str = None,
            latitude: float = None,
            longitude: float = None,
            floor: str = None,
            comment: str = None
    ) -> UserAddress | None:
        async with self.ssn() as ssn:
            if street and floor and flat and entrance and latitude and longitude and comment and city_id and house:
                return await ssn.scalar(select(UserAddress).where(
                    UserAddress.street == street,
                    UserAddress.floor == floor,
                    UserAddress.flat == flat,
                    UserAddress.entrance == entrance,
                    UserAddress.latitude == latitude,
                    UserAddress.longitude == longitude,
                    UserAddress.comment == comment,
                    UserAddress.city_id == city_id,
                    UserAddress.house == house
                ))
            return await ssn.scalar(select(UserAddress).where(UserAddress.id == id))

    async def update_user_address(
            self,
            id: int,
            user_id: int,
            street: str,
            city_id: int,
            house: str = None,
            floor: str = None,
            flat: str = None,
            entrance: str = None,
            latitude: float = None,
            longitude: float = None,
            comment: str = None
    ) -> UserAddress | None:
        async with self.ssn() as ssn:
            user_address = await ssn.scalar(select(UserAddress).where(UserAddress.id == id))
            if user_address is not None:
                if user_id is None:
                    user_id = user_address.user_id
                if city_id is None:
                    city_id = user_address.city_id
                if street is None:
                    street = user_address.street
                if house is None:
                    house = user_address.house
                if floor is None:
                    floor = user_address.floor
                if flat is None:
                    flat = user_address.flat
                if entrance is None:
                    entrance = user_address.entrance
                if latitude is None:
                    latitude = user_address.latitude
                if longitude is None:
                    longitude = user_address.longitude
                if comment is None:
                    comment = user_address.comment
                await ssn.execute(update(UserAddress).where(UserAddress.id == id).values(
                    user_id=user_id,
                    city_id=city_id,
                    street=street,
                    house=house,
                    floor=floor,
                    flat=flat,
                    entrance=entrance,
                    latitude=latitude,
                    longitude=longitude,
                    comment=comment
                ))
                await ssn.flush()
                await ssn.refresh(user_address)
                await ssn.commit()
                return user_address
    # UserAddress

    # BranchAddress
    async def add_branch_address(
            self,
            street: str,
            city_id: int,
            house: str = None,
            floor: str = None,
            flat: str = None,
            entrance: str = None,
            latitude: float = None,
            longitude: float = None,
            comment: str = None
    ) -> BranchAddress | None:
        async with self.ssn() as ssn:
            branch_address = BranchAddress(
                city_id=city_id,
                street=street,
                house=house,
                floor=floor,
                flat=flat,
                entrance=entrance,
                latitude=latitude,
                longitude=longitude,
                comment=comment
            )
            ssn.add(branch_address)
            await ssn.flush()
            await ssn.refresh(branch_address)
            await ssn.commit()
            return branch_address

    async def get_branch_addresses(
            self,
            city_id: int = None
    ) -> Sequence[BranchAddress] | None:
        async with self.ssn() as ssn:
            query = select(BranchAddress)
            if city_id is not None:
                query = query.where(BranchAddress.city_id == city_id)
            return (await ssn.scalars(query)).all()

    async def get_branch_address(
            self,
            id: int,
            branch_id: int = None
    ) -> BranchAddress | None:
        async with self.ssn() as ssn:
            query = select(BranchAddress)
            if branch_id is not None:
                query = query.where(BranchAddress.branch_id == branch_id)
            if id is not None:
                query = query.where(BranchAddress.id == id)
            return await ssn.scalar(query)

    async def update_branch_address(
            self,
            id: int,
            street: str,
            city_id: int,
            house: str = None,
            floor: str = None,
            flat: str = None,
            entrance: str = None,
            latitude: float = None,
            longitude: float = None,
            comment: str = None
    ) -> BranchAddress | None:
        async with self.ssn() as ssn:
            branch_address = await ssn.scalar(select(BranchAddress).where(BranchAddress.id == id))
            if branch_address is not None:
                if city_id is None:
                    city_id = branch_address.city_id
                if street is None:
                    street = branch_address.street
                if house is None:
                    house = branch_address.house
                if floor is None:
                    floor = branch_address.floor
                if flat is None:
                    flat = branch_address.flat
                if entrance is None:
                    entrance = branch_address.entrance
                if latitude is None:
                    latitude = branch_address.latitude
                if longitude is None:
                    longitude = branch_address.longitude
                if comment is None:
                    comment = branch_address.comment
                await ssn.execute(update(BranchAddress).where(BranchAddress.id == id).values(
                    city_id=city_id,
                    street=street,
                    house=house,
                    floor=floor,
                    flat=flat,
                    entrance=entrance,
                    latitude=latitude,
                    longitude=longitude,
                    comment=comment
                ))
                await ssn.commit()
                await ssn.flush()
                await ssn.refresh(branch_address)
            return branch_address
    # BranchAddress

    # Search
    async def add_search(
            self,
            category_id: int,
            name: str,
            sub_category_id: int
    ) -> Search | None:
        async with self.ssn() as ssn:
            search = Search(
                category_id=category_id,
                name=name,
                sub_category_id=sub_category_id
            )
            ssn.add(search)
            await ssn.flush()
            await ssn.refresh(search)
            await ssn.commit()
            return search

    async def get_search(
            self,
            id: int
    ) -> Search | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(Search).where(Search.id == id))

    async def get_searches(
            self,
            category_id: int = None,
            sub_category_id: int = None
    ) -> Sequence[Search] | None:
        async with self.ssn() as ssn:
            query = select(Search)
            if category_id is not None:
                query = query.where(Search.category_id == category_id)
            if sub_category_id is not None:
                query = query.where(Search.sub_category_id == sub_category_id)
            return (await ssn.scalars(query)).all()

    async def update_search(
            self,
            id: int,
            category_id: int,
            name: str,
            sub_category_id: int
    ) -> Search | None:
        async with self.ssn() as ssn:
            search = await ssn.scalar(select(Search).where(Search.id == id))
            if search is not None:
                if category_id is None:
                    category_id = search.category_id
                if name is None:
                    name = search.name
                if sub_category_id is None:
                    sub_category_id = search.sub_category_id
                await ssn.execute(update(Search).where(Search.id == id).values(
                    category_id=category_id,
                    name=name,
                    sub_category_id=sub_category_id
                ))
                await ssn.commit()
                await ssn.flush()
                await ssn.refresh(search)
            return search

    async def delete_search(self, id: int) -> int | None:
        async with self.ssn() as ssn:
            search = await ssn.scalar(select(Search).where(Search.id == id))
            category_id = search.category_id
            if search is not None:
                await ssn.execute(delete(Search).where(Search.id == id))
                await ssn.commit()
                return category_id
        return
    # Search

    # Category
    async def add_category(
            self,
            name: str,
            image_path: str
    ) -> Category | None:
        async with self.ssn() as ssn:
            category = Category(
                name=name,
                image_path=image_path
            )
            ssn.add(category)
            await ssn.flush()
            await ssn.refresh(category)
            await ssn.commit()
            return category

    async def get_category(
            self,
            id: int
    ) -> Category | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(Category).where(Category.id == id))

    async def get_categories(
            self
    ) -> Sequence[Category] | None:
        async with self.ssn() as ssn:
            query = select(Category).options(joinedload(Category.sub_categories)
                                             .joinedload(SubCategory.products)
                                             .joinedload(Product.tags))
            return (await ssn.scalars(query)).unique().all()

    async def update_category(
            self,
            id: int,
            name: str,
            image_path: str
    ) -> Category | None:
        async with self.ssn() as ssn:
            category = await self.get_category(id)
            if category is not None:
                if name is None:
                    name = category.name
                if image_path is None:
                    image_path = category.image_path
                await ssn.execute(update(Category).where(Category.id == id).values(
                    name=name,
                    image_path=image_path
                ))
                await ssn.flush()
                await ssn.refresh(category)
                await ssn.commit()
                return category
    # Category

    # SubCategory
    async def add_sub_category(
            self,
            name: str,
            category_id: int,
            image_path: str,
            is_available: bool = True
    ) -> SubCategory | None:
        async with self.ssn() as ssn:
            sub_category = SubCategory(
                name=name,
                category_id=category_id,
                image_path=image_path,
                is_available=is_available
            )
            ssn.add(sub_category)
            await ssn.flush()
            await ssn.refresh(sub_category)
            await ssn.commit()
            return sub_category

    async def get_sub_category(
            self,
            id: int,
    ) -> SubCategory | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(SubCategory).where(SubCategory.id == id))

    async def get_sub_categories(
            self,
            category_id: int = None
    ) -> Sequence[SubCategory] | None:
        async with self.ssn() as ssn:
            query = select(SubCategory)
            if category_id is not None:
                query = query.where(SubCategory.category_id == category_id)
            return (await ssn.scalars(query)).all()

    async def update_sub_category(
            self,
            id: int,
            name: str = None,
            image_path: str = None,
            is_available: bool = None,
    ) -> SubCategory | None:
        async with self.ssn() as ssn:
            sub_category = await ssn.scalar(select(SubCategory).where(SubCategory.id == id))
            if sub_category is not None:
                if name is None:
                    name = sub_category.name
                if image_path is None:
                    image_path = sub_category.image_path
                if is_available is None:
                    sub_category.is_available = is_available
                await ssn.execute(update(SubCategory).where(SubCategory.id == id).values(
                    name=name,
                    image_path=image_path,
                    is_available=is_available
                ))
                await ssn.flush()
                await ssn.refresh(sub_category)
                await ssn.commit()
                return sub_category

    # Tag
    async def add_tag(
            self,
            product_id: int,
            name: str,
            first_color: str,
            second_color: str
    ) -> Product:
        async with self.ssn() as ssn:
            tag = Tag(
                name=name,
                first_color=first_color,
                second_color=second_color,
                product_id=product_id
            )
            ssn.add(tag)
            await ssn.flush()
            await ssn.refresh(tag)
            await ssn.commit()
            return await ssn.scalar(select(Product).where(Product.id == product_id))

    async def get_tag(
            self,
            id: int
    ) -> Tag | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(Tag).where(Tag.id == id))

    async def get_tags(
        self,
        product_id: int = None
    ) -> Sequence[Tag] | None:
        async with self.ssn() as ssn:
            query = select(Tag)
            if product_id is not None:
                query = query.where(Tag.product_id == product_id)
            return (await ssn.scalars(query)).all()

    async def update_tag(
            self,
            id: int,
            name: str,
            first_color: str,
            second_color: str,
    ) -> Product:
        async with self.ssn() as ssn:
            tag = await ssn.scalar(select(Tag).where(Tag.id == id))
            if tag is not None:
                if name is None:
                    name = tag.name
                if first_color is None:
                    first_color = tag.first_color
                if second_color is None:
                    second_color = tag.second_color
                await ssn.execute(update(Tag).where(Tag.id == id).values(
                    name=name,
                    first_color=first_color,
                    second_color=second_color
                ))
                await ssn.flush()
                await ssn.refresh(tag)
                await ssn.commit()
                return await ssn.scalar(select(Product).where(Product.id == tag.product_id))

    async def delete_tag(self, id: int) -> Product:
        async with self.ssn() as ssn:
            tag = await ssn.scalar(select(Tag).where(Tag.id == id))
            product_id = tag.product_id
            if tag is not None:
                await ssn.execute(delete(Tag).where(Tag.id == id))
                await ssn.commit()
                return await ssn.scalar(select(Product).where(Product.id == product_id))
    # Tag

    # ProductContains
    async def add_product_contains(
            self,
            amount: str,
            name: str,
            product_id: int
    ) -> Product | None:
        async with self.ssn() as ssn:
            product_contains = ProductContains(
                product_id=product_id,
                amount=amount,
                name=name
            )
            ssn.add(product_contains)
            await ssn.flush()
            await ssn.refresh(product_contains)
            await ssn.commit()
            return await ssn.scalar(select(Product).where(Product.id == product_contains.product_id))

    async def get_product_contains(
            self,
            id: int
    ) -> ProductContains | None:
        async with self.ssn() as ssn:
            return await ssn.scalar(select(ProductContains).where(ProductContains.id == id))

    async def get_product_containses(
            self,
            product_id: int = None
    ) -> Sequence[ProductContains] | None:
        async with self.ssn() as ssn:
            query = select(ProductContains)
            if product_id is not None:
                query = query.where(ProductContains.product_id == product_id)
            return (await ssn.scalars(query)).all()

    async def update_product_contains(
            self,
            id: int,
            amount: str,
            name: str
    ) -> Product | None:
        async with self.ssn() as ssn:
            product_contains = await ssn.scalar(select(ProductContains).where(ProductContains.id == id))
            if product_contains is not None:
                if amount is None:
                    amount = product_contains.amount
                if name is None:
                    name = product_contains.name
                await ssn.execute(update(ProductContains).where(ProductContains.id == id).values(
                    amount=amount,
                    name=name
                ))
                await ssn.flush()
                await ssn.refresh(product_contains)
                await ssn.commit()
                return await ssn.scalar(select(Product).where(Product.id == product_contains.product_id))

    async def delete_product_contains(
            self,
            id: int
    ) -> Product | None:
        async with self.ssn() as ssn:
            product_contains = await ssn.scalar(select(ProductContains).where(ProductContains.id == id))
            product_id = product_contains.product_id
            if product_contains is None:
                return
            await ssn.execute(delete(ProductContains).where(ProductContains.id == id))
            await ssn.commit()
            product = await ssn.scalar(select(Product).where(Product.id == product_id))
            return product
    # ProductContains

    async def get_available_categories_by_city(self, city_id: int) -> list[Category] | None:
        async with self.ssn(expire_on_commit=False) as ssn:
            categories = (await ssn.scalars(select(Category).options(
                selectinload(Category.sub_categories).selectinload(SubCategory.products)))).unique().all()
            result = []

            for category in categories:
                searches = (await ssn.scalars(select(Search).where(Search.category_id == category.id))).unique().all()
                category_data = {
                    "id": category.id,
                    "name": category.name,
                    "sub_categories": [],
                    "image_path": category.image_path,
                    "searches": searches,
                    "created": category.created,
                    "updated": category.updated
                }
                for sub_category in category.sub_categories:
                    sub_category_data = {
                        "id": sub_category.id,
                        "category_id": category.id,
                        "name": sub_category.name,
                        "image_path": sub_category.image_path,
                        "products": [],
                        "created": sub_category.created,
                        "updated": sub_category.updated
                    }

                    for product in sub_category.products:
                        # Агрегируем количество по всем филиалам в конкретном городе
                        branch_product_sum = await ssn.scalar(select(func.sum(BranchProduct.amount))
                                                              .join(BranchProduct.branch)
                                                              .filter(BranchProduct.product_id == product.id,
                                                                      BranchProduct.is_available,
                                                                      Branch.city_id == city_id))
                        if branch_product_sum:
                            tags = await ssn.scalars(
                                select(Tag).where(Tag.product_id == product.id)
                            )
                            tags.all()
                            product_data = {
                                "id": product.id,
                                "name": product.name,
                                "available_amount": branch_product_sum,
                                "description": product.description,
                                "manufacturer": product.manufacturer,
                                "image_path": product.image_path,
                                "price": float(product.price),
                                "units_of_measure": product.units_of_measure,
                                "previous_price": product.previous_price,
                                "is_available": product.is_available,
                                "amount": product.amount,
                                "expiration": product.expiration,
                                "storage": product.storage,
                                "created": str(product.created),
                                "updated": str(product.updated),
                                "sub_category_id": sub_category.id
                            }
                            contains = (await ssn.scalars(select(ProductContains)
                                                          .where(ProductContains.product_id == product.id))
                                        ).unique().all()
                            product_data["contains"] = contains

                            tags = await ssn.scalars(select(Tag).where(Tag.product_id == product.id))
                            tags = tags.all()
                            product_data["tags"] = tags

                            sub_category_data["products"].append(product_data)
                    category_data["sub_categories"].append(sub_category_data)
                result.append(category_data)
                for category_ in result:
                    for sub_category in category_["sub_categories"]:
                        if len(sub_category["products"]) == 0:
                            category_["sub_categories"].remove(sub_category)
                    category_["sub_categories"].sort(key=lambda x: x["name"])
            return result

    async def get_branch_products_with_categories(self, branch_id: int):
        async with self.ssn() as ssn:
            query = select(Branch).options(
                selectinload(Branch.products).joinedload(BranchProduct.product)
                .joinedload(Product.sub_category).joinedload(SubCategory.category),
                selectinload(Branch.products).joinedload(BranchProduct.product).selectinload(Product.branch_products),
            ).where(Branch.id == branch_id)

            branch = (await ssn.scalars(query)).first()

            categories = {}

            for branch_product in branch.products:
                product = branch_product.product
                sub_category = product.sub_category
                category = sub_category.category

                if category.id not in categories:
                    categories[category.id] = {
                        "id": category.id,
                        "name": category.name,
                        "image_path": category.image_path,
                        "sub_categories": {}
                    }

                sub_categories = categories[category.id]["sub_categories"]
                if sub_category.id not in sub_categories:
                    sub_categories[sub_category.id] = {
                        "id": sub_category.id,
                        "name": sub_category.name,
                        "image_path": sub_category.image_path,
                        "is_available": sub_category.is_available,
                        "branch_products": []
                    }

                sub_categories[sub_category.id]["branch_products"].append({
                    "id": branch_product.id,
                    "amount": branch_product.amount,
                    "is_available": branch_product.is_available,
                    "product": {
                        "id": product.id,
                        "name": product.name,
                        "price": float(product.price),
                        "description": product.description,
                        "image_path": product.image_path,
                        "is_available": product.is_available
                    }
                })

            for category in categories.values():
                category["sub_categories"] = list(category["sub_categories"].values())

            return list(categories.values())