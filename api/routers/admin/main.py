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

r = APIRouter(prefix="/admin", tags=["Admin"])
ar = APIRouter(prefix="/admin", tags=["Admin"])

r.include_router(ar)
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

@r.get('', response_class=HTMLResponse)
async def get_admin_panel():
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


@ar.post('/login', response_class=JSONResponse)
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