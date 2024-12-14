from fastapi import APIRouter, Depends, Request, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from database.engine import Database
from api.models.category import CategoryRead, SubCategoryCreate, SubCategoryUpdate, SearchCreate, SearchUpdate
from api.routers.access_token import check_admin_token
import os

r = APIRouter(prefix="", tags=["Admin"])

db = Database()

@r.put("/update_sub_category", response_model=CategoryRead)
async def update_sub_category(
    request: Request,
    name: str = Form(...),
    id: int = Form(...),
    is_available: bool = Form(True),
    image_file: UploadFile | None = File(None)
):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        file_path = None
        if image_file:
            file_path = os.path.join('./static/' + image_file.filename)
            with open(file_path, "wb") as f:
                f.write(await image_file.read())
        updated_sub_category = await db.update_sub_category(
            id=id,
            name=name,
            image_path=file_path,
            is_available=is_available
        )
        if updated_sub_category:
            category = await db.get_category(id=updated_sub_category.category_id)
            if category:
                return jsonable_encoder(CategoryRead.model_validate(category))
            else:
                raise HTTPException(status_code=404, detail="Category not found")
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.post('/add_sub_category', response_model=CategoryRead)
async def add_sub_category(
    request: Request,
    category_id: int = Form(...),
    name: str = Form(...),
    is_available: bool = Form(True),
    image_file: UploadFile = File(...)
):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        file_path = os.path.join('./static/', image_file.filename)
        with open(file_path, "wb") as f:
            f.write(await image_file.read())
        sub_category = await db.add_sub_category(name=name, category_id=category_id,
                                                 image_path=file_path, is_available=is_available)
        if sub_category:
            category = await db.get_category(id=sub_category.category_id)
            return jsonable_encoder(CategoryRead.model_validate(category))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))