from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse

from api.models.order import OrderPriorityRead, OrderStatusRead, OrderPriorityUpdate, OrderStatusUpdate
from database.engine import Database
from api.routers.access_token import check_admin_token

r = APIRouter()

db = Database()


@r.get("/order_priorities", response_model=list[OrderPriorityRead])
async def get_priorities(request: Request):
    try:
        admin = await check_admin_token(request=request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        order_priorities = await db.get_order_priorities()
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderPriorityRead.model_validate(order_priority) for order_priority in order_priorities))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.get("/statuses", response_model=list[OrderStatusRead])
async def get_order_statuses():
    try:
        order_statuses = await db.get_order_statuses()
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderStatusRead.model_validate(order_status) for order_status in order_statuses))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.put('/order_priority', response_model=OrderPriorityRead)
async def update_order_priority(order_priority: OrderPriorityUpdate):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        order_priority = await db.update_order_priority(
            id=order_priority.id,
            name=order_priority.name,
            extra_cost=order_priority.extra_cost,
            priority=order_priority.priority
        )
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderPriorityRead.model_validate(order_priority)))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.put('/order_status', response_model=OrderStatusRead)
async def update_order_status(order_status: OrderStatusUpdate):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        order_status = await db.update_order_status(
            id=order_status.id,
            name=order_status.name,
            full_status=order_status.full_status,
            description=order_status.description
        )
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderStatusRead.model_validate(order_status)))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.get('/delivery_price')
async def get_delivery_cost():
    try:
        delivery_cost = await db.get_delivery_price()
        return JSONResponse(status_code=200, content=jsonable_encoder(delivery_cost))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.put('/delivery_price')
async def update_delivery_cost(request: Request, start_price: float, cost_per_100m: float):
    try:
        admin = await check_admin_token(request=request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        delivery_cost = await db.update_delivery_price(
            start_price=start_price,
            cost_per_100m=cost_per_100m
        )
        return JSONResponse(status_code=200, content=jsonable_encoder(
            {'start_price': delivery_cost.start_price, 'cost_per_100m': delivery_cost.cost_per_100m}
        ))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.put('/tax')
async def update_tax(request: Request, tax: float):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        tax_ = await db.update_tax(
            tax=tax
        )
        return JSONResponse(status_code=200, content=jsonable_encoder({'tax': tax_.tax}))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))