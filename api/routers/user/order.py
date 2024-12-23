from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from api.models.order import OrderRead, OrderCreate, OrderProductRead
from api.routers.user.main import check_user_token
from database.engine import Database
from api.functions import get_delivery_price_, send_order_request

r = APIRouter(tags=["User"])

db = Database()


@r.get('/tax')
async def get_tax() -> float:
    try:
        tax = await db.get_tax()
        return JSONResponse(status_code=200, content={"tax": float(tax.tax)})
    except Exception as e:
        return JSONResponse(status_code=200, content={"error": str(e)})

@r.get('/delivery_price/')
async def get_delivery_price(city_name: str, lat: float, lon: float):
    try:
        delivery_price = await get_delivery_price_(city_name=city_name, lat=lat, lon=lon)
        return JSONResponse(status_code=200, content={"delivery_price": delivery_price})
    except Exception as e:
        return JSONResponse(status_code=200, content={"error": str(e)})

@r.get("/orders/", response_model=list[OrderRead])
async def get_orders(request: Request):
    try:
        user = await check_user_token(request=request)
        if not user:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        orders = await db.get_orders(user_id=user.id)

        return JSONResponse(
            status_code=200,
            content=jsonable_encoder([OrderRead.model_validate(order) for order in orders])
        )
    except Exception as e:
        raise e
        return JSONResponse(status_code=200, content={"error": str(e)})

@r.get("/order/")
async def get_order(order_id: int):
    try:
        order = await db.get_order(id=order_id)

        return JSONResponse(status_code=200, content=jsonable_encoder(OrderRead.model_validate(order)))

    except Exception as e:
        return JSONResponse(status_code=200, content={"error": str(e)})

@r.post("/order/")
async def create_order(order: OrderCreate, request: Request):
    try:
        user = await check_user_token(request=request)

        if not user:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})

        address = order.address

        if address is None:
            return JSONResponse(status_code=200, content={"error": "Address not found"})

        address_ = await db.get_user_address(
            street=address.street,
            house=address.house,
            floor=address.floor,
            flat=address.flat,
            entrance=address.entrance,
            latitude=address.latitude,
            longitude=address.longitude,
            comment=address.comment,
            city_id=user.city_id
        )
        if address_ is not None:
            address = address_
        else:
            address = await db.add_user_address(
                user_id=user.id,
                street=address.street,
                house=address.house,
                floor=address.floor,
                flat=address.flat,
                entrance=address.entrance,
                latitude=address.latitude,
                longitude=address.longitude,
                comment=address.comment,
                city_id=user.city_id
            )

        total_price = 0.0

        order_ = await db.add_order(
            user_id=user.id,
            address_id=address.id,
            payment_method=order.payment_method,
            delivery_price=order.delivery_price,
            status_id=1,
            priority_id=order.priority_id,
            curier_tips=order.curier_tips,
            tax=order.tax
        )

        for product in order.products:

            branch = await db.get_branch_by_product_id(
                product_id=product.product_id,
                amount=product.amount,
                city_id=user.city_id
            )

            if branch is None:

                product = await db.get_product(id=product.product_id)

                return JSONResponse(status_code=203, content={
                    "error": f"Product #{product.name} not in stock",
                    'product_id': product.id
                })

            order_product = await db.add_order_product(
                order_id=order_.id,
                product_id=product.product_id,
                amount=product.amount,
                branch_id=branch.id
            )
            branch_product = await db.get_branch_product(branch_id=branch.id, product_id=product.product_id)
            await db.update_branch_product(id=order_product.id, amount=branch_product.amount - order_product.amount)
            total_price += float(order_product.amount) * float(order_product.product.price)

        await db.update_order(id=order_.id, total_price=total_price)
        order = await db.get_order(id=order_.id)
        order_data = jsonable_encoder(OrderRead.model_validate(order))
        await send_order_request(order=order)
        return JSONResponse(status_code=200, content=order_data)

    except Exception as e:
        raise e
        return JSONResponse(status_code=200, content={"error": str(e)})

@r.get("/orders-mobile/", response_model=list[OrderRead])
async def get_orders(user_id: int):
    try:
        orders = await db.get_orders(user_id=user_id)

        return JSONResponse(
            status_code=200,
            content=jsonable_encoder([OrderRead.model_validate(order) for order in orders])
        )


    except Exception as e:

        raise e

        return JSONResponse(status_code=200, content={"error": str(e)})

@r.get("/order-mobile/")
async def get_order(order_id: int):
    try:
        order = await db.get_order(id=order_id)
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderRead.model_validate(order)))
    except Exception as e:
        return JSONResponse(status_code=200, content={"error": str(e)})

@r.post("/order-mobile/")
async def create_order_mobile(order: OrderCreate, token: str):
    try:
        user = await check_user_token(token=token)

        if not user:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})

        address = order.address

        if address is None:
            return JSONResponse(status_code=200, content={"error": "Address not found"})



        address = await db.add_user_address(
            user_id=user.id,
            street=address.street,
            house=address.house,
            floor=address.floor,
            flat=address.flat,
            entrance=address.entrance,
            latitude=address.latitude,
            longitude=address.longitude,
            comment=address.comment,
            city_id=user.city_id
        )

        total_price = 0.0

        order_ = await db.add_order(
            user_id=user.id,
            address_id=address.id,
            payment_method=order.payment_method,
            delivery_price=order.delivery_price,
            status_id=1,
            priority_id=order.priority_id,
            curier_tips=order.curier_tips,
            tax=order.tax
        )

        for product in order.products:

            branch = await db.get_branch_by_product_id(
                product_id=product.product_id,
                amount=product.amount,
                city_id=user.city_id
            )

            if branch is None:

                product = await db.get_product(id=product.product_id)

                return JSONResponse(status_code=203, content={
                    "error": f"Product #{product.name} not in stock",
                    'product_id': product.id
                })

            order_product = await db.add_order_product(
                order_id=order_.id,
                product_id=product.product_id,
                amount=product.amount,
                branch_id=branch.id
            )

            total_price += float(order_product.amount) * float(order_product.product.price)

        await db.update_order(id=order_.id, total_price=total_price)

        order = await db.get_order(id=order_.id)
        order_data = jsonable_encoder(OrderRead.model_validate(order))
        await send_order_request(order=order)
        return JSONResponse(status_code=200, content=order_data)

    except Exception as e:
        raise e
        return JSONResponse(status_code=200, content={"error": str(e)})