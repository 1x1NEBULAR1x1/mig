from fastapi import APIRouter, Depends, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from database.engine import Database
from api.models.category import CategoryRead, CategoryCreate, CategoryUpdate, SearchCreate, SearchUpdate
from api.routers.access_token import check_admin_token

r = APIRouter(prefix="", tags=["Admin"])
db = Database()


@r.put("/update_category", response_model=CategoryRead)
async def update_category(category: CategoryUpdate):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        category = await db.update_category(id=category.id, name=category.name, image_path=category.image_path)
        return jsonable_encoder(CategoryRead.model_validate(category))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))


@r.post("/add_search", response_model=CategoryRead)
async def add_search(search: SearchCreate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        search = await db.add_search(name=search.name, category_id=search.category_id,
                                     sub_category_id=search.sub_category_id)
        if search:
            category = await db.get_category(id=search.category_id)
            return jsonable_encoder(CategoryRead.model_validate(category))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.put("/update_search", response_model=CategoryRead)
async def update_search(search: SearchUpdate, request: Request):
    try:
        category_id = search.category_id
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        search = await db.update_search(id=search.id, name=search.name, category_id=search.category_id,
                                     sub_category_id=search.sub_category_id)
        if search:
            category = await db.get_category(id=category_id)
            return jsonable_encoder(CategoryRead.model_validate(category))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.delete("/delete_search", response_model=CategoryRead)
async def delete_search(search_id: int, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        category_id = await db.delete_search(id=search_id)
        if category_id:
            category = await db.get_category(id=category_id)
            return jsonable_encoder(CategoryRead.model_validate(category))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))