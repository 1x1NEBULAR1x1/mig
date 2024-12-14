from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from api.models.order import OrderRead, OrderPriorityRead, OrderStatusRead
from database.engine import Database
from api.routers.access_token import check_admin_token


db = Database()

r = APIRouter()

@r.get("/orders", response_class=JSONResponse, response_model=list[OrderRead])
async def get_orders(request: Request):
    try:
        admin = await check_admin_token(request=request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        orders = await db.get_orders()
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderRead.model_validate(order) for order in orders))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.put('/order', response_model=OrderRead)
async def update_order(order: OrderRead, request: Request):
    try:
        admin = await check_admin_token(request=request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        order = await db.update_order(
            id=order.id,
            status_id=order.status_id,
            finished=order.finished,
            curier_id=order.curier_id,
            total_price=order.total_price,
            priority_id=order.priority_id,
            time_to_delivery=order.time_to_delivery,
            delivery_price=order.delivery_price
        )
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderRead.model_validate(order)))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.get('/order_priorities', response_model=list[OrderPriorityRead])
async def get_order_priorities():
    try:
        order_priorities = await db.get_order_priorities()
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderPriorityRead.model_validate(order_priority) for order_priority in order_priorities))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.get('/order_statuses', response_model=list[OrderStatusRead])
async def get_order_statuses():
    try:
        order_statuses = await db.get_order_statuses()
        return JSONResponse(status_code=200, content=jsonable_encoder(OrderStatusRead.model_validate(order_status) for order_status in order_statuses))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))