from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from fastapi.requests import Request
from starlette.responses import JSONResponse
from api.models.user import Admin
from api.routers.admin.cities import r as cities_router
from api.routers.admin.users import r as users_router
from api.routers.admin.categories import r as categories_router
from api.routers.admin.sub_categories import r as sub_categories_router
from api.routers.admin.orders import r as orders_router
from api.routers.admin.products import r as products_router
from api.routers.admin.branches import r as branches_router
from api.routers.admin.settings import r as settings_router
from database.engine import Database
from api.routers.access_token import create_access_token, check_admin_token
from datetime import timedelta
from fastapi.templating import Jinja2Templates
from api.models.category import CategoryRead
from api.models.city import CityRead
from api.models.order import OrderPriorityUpdate, OrderPriorityRead
from fastapi.encoders import jsonable_encoder

r = APIRouter(prefix="/panel", tags=["Admin"])
ar = APIRouter(prefix="/admin", tags=["Admin"])


db = Database()
templates = Jinja2Templates(directory='./admin_panel/dist')

ar.include_router(cities_router)
ar.include_router(users_router)
ar.include_router(categories_router)
ar.include_router(sub_categories_router)
ar.include_router(products_router)
ar.include_router(orders_router)
ar.include_router(branches_router)
ar.include_router(settings_router)

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
@r.get('/tax')
async def get_tax() -> float:
    try:
        tax = await db.get_tax()
        return JSONResponse(status_code=200, content={"tax": float(tax.tax)})
    except Exception as e:
        return JSONResponse(status_code=200, content={"error": str(e)})

@r.get('', response_class=HTMLResponse)
async def get_admin_panel(request: Request):
    return templates.TemplateResponse(name='index.html', request=request)

@ar.get('/codes')
async def get_codes():
    try:
        codes = await db.get_codes()
        return JSONResponse(status_code=200, content=jsonable_encoder(
            [
                {
                    'code': code.code,
                    'phone_number': code.phone_number,
                    'is_userd': code.is_used
                } for code in codes
            ]
        ))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))


@r.post('/admin/login', response_class=JSONResponse)
async def login(admin: Admin, response: JSONResponse):
    try:
        admin = await db.login_admin(login=admin.login, password=admin.hashed_password)
        if admin is None:
            return JSONResponse(status_code=402, content={"message": "Bad data"})

        access_token = create_access_token(data={"sub": admin.login, "pass": admin.hashed_password})
        response.set_cookie(
            key="admin_token",
            value=access_token,
            path="/",
            samesite="Lax"
        )
        return {"message": "Success", "admin_token": access_token}
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@ar.get("/protected", response_class=JSONResponse)
async def protected(request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        return {"message": "Success"}
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

r.include_router(ar)