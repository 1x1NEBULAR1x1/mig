from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse
from database.engine import Database
from api.models.user import UserRead, UserCreate, UserUpdate
from api.routers.access_token import check_admin_token

r = APIRouter(prefix="", tags=["Admin"])
db = Database()


@r.get("/users")
async def get_users(request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        users = await db.get_users()
        return JSONResponse(
            status_code=200,
            content=jsonable_encoder(
                [UserRead.model_validate(user) for user in users]
            ),
        )
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))


@r.put("/update_user", response_model=UserRead)
async def update_user(user: UserUpdate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        user = await db.update_user(id=user.id, is_banned=user.is_banned)
        return JSONResponse(status_code=200, content=jsonable_encoder(UserRead.model_validate(user)))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))
