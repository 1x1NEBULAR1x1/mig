import os.path
from pydantic import parse_obj_as
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder
from database.engine import Database
from api.models.product import ProductRead
from api.models.category import CategoryRead, CategoryAvailable
from api.models.city import CityUpdate, CityRead
from api.routers.user.order import r as user_order_router
from api.routers.admin.main import r as admin_router
from api.models.order import OrderPriorityUpdate

templates = Jinja2Templates(directory='./mobile_frontend/dist')

r = APIRouter(tags=['main'])

r.include_router(user_order_router)

r.include_router(admin_router)

db = Database()



@r.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(name='index.html', request=request)

@r.get("/catalog", response_class=JSONResponse, response_model=list[CategoryAvailable])
async def get_catalog(city_id: int):
    try:
        categories = await db.get_available_categories_by_city(city_id=city_id)
        return [CategoryAvailable.model_validate(category) for category in categories]
    except Exception as e:
        raise e
        return JSONResponse(status_code=200, content=str(e))

@r.get("/categories", response_class=JSONResponse, response_model=list[CategoryRead])
async def get_categories():
    try:
        categories = await db.get_categories()
        return jsonable_encoder(CategoryRead.model_validate(category) for category in categories)
    except Exception as e:
        raise e
        return JSONResponse(status_code=200, content=str(e))

@r.get("/cities", response_class=JSONResponse, response_model=list[CityRead])
async def get_cities():
    try:
        cities = await db.get_cities()
        return [CityRead.model_validate(city) for city in cities]
    except Exception as e:
        raise e
        return JSONResponse(status_code=200, content=str(e))

@r.get("/order_priorities", response_class=JSONResponse, response_model=list[OrderPriorityUpdate])
async def get_orders_priorities():
    try:
        priorities = await db.get_order_priorities()
        return [OrderPriorityUpdate.model_validate(priority) for priority in priorities]
    except Exception as e:
        raise e
        return JSONResponse(status_code=200, content=str(e))

@r.get("/product", response_model=ProductRead)
async def get_product(id: int):
    try:
        product = await db.get_product(id=id)
        return jsonable_encoder(ProductRead.model_validate(product))
    except Exception as e:
        raise e
        return JSONResponse(status_code=200, content=str(e))