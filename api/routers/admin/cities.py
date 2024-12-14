from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse

from database.engine import Database
from api.models.city import CityRead, CityCreate, CityUpdate
from fastapi.requests import Request
from api.routers.access_token import check_admin_token


r = APIRouter(prefix="", tags=["Admin"])
db = Database()

@r.post("/add_city", response_model=CityRead)
async def add_city(city: CityCreate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        city = await db.add_city(name=city.name, is_available=city.is_available)
        return JSONResponse(status_code=200, content=jsonable_encoder(CityRead.model_validate(city)))
    except Exception as e:
        print(e)
        return None

@r.put("/update_city", response_model=CityRead)
async def update_city(city: CityUpdate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        city = await db.update_city(id=city.id, name=city.name, is_available=city.is_available)
        return jsonable_encoder(CityRead.model_validate(city))
    except Exception as e:
        print(e)
        return None
