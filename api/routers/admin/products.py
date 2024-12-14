from fastapi import APIRouter, Form, File, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from database.engine import Database
from api.models.product import ProductContainsCreate, ProductRead, ProductContainsUpdate, ProductContainsRead
from api.models.tag import TagCreate, TagUpdate
from api.routers.access_token import check_admin_token
from typing import Optional
import os

db = Database()

r = APIRouter(prefix="", tags=["Admin"])



@r.post("/product", response_model=ProductRead)
async def add_product(
    request: Request,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    sub_category_id: int = Form(...),
    expiration: str = Form(...),
    is_available: bool = Form(True),
    amount: int = Form(...),
    units_of_measure: str = Form(...),
    compound: str = Form(...),
    storage: str = Form(...),
    manufacturer: str = Form(...),
    previous_price: str | None = Form(None),
    image_file: UploadFile = File(...),
):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        file_path = os.path.join('./static/', image_file.filename)
        with open(file_path, "wb") as f:
            f.write(await image_file.read())
        if previous_price is not None and previous_price != "":
            previous_price = float(previous_price)
        product = await db.add_product(
            name=name,
            description=description,
            price=price,
            image_path=file_path,
            sub_category_id=sub_category_id,
            expiration=expiration,
            is_available=is_available,
            amount=amount,
            units_of_measure=units_of_measure,
            compound=compound,
            storage=storage,
            manufacturer=manufacturer,
            previous_price=previous_price
        )
        return jsonable_encoder(ProductRead.model_validate(product))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.post("/product_contains", response_model=ProductContainsRead)
async def add_product_contains(product_contains: ProductContainsCreate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        product_contains = await db.add_product_contains(
            product_id=product_contains.product_id,
            name=product_contains.name,
            amount=product_contains.amount
        )
        return jsonable_encoder(ProductContainsRead.model_validate(product_contains))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.put("/product", response_model=ProductRead)
async def update_product(
    request: Request,
    id: int = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    image_file: UploadFile | None = File(None),
    sub_category_id: int = Form(...),
    expiration: str = Form(...),
    is_available: bool = Form(True),
    amount: int = Form(...),
    units_of_measure: str = Form(...),
    compound: str = Form(...),
    storage: str = Form(...),
    manufacturer: str = Form(...),
    previous_price: str | None = Form(None)
):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        if image_file:
            file_path = os.path.join('./static/' + image_file.filename)
            with open(file_path, "wb") as f:
                f.write(await image_file.read())
        else:
            file_path = None
        if previous_price == '':
            previous_price = None
        elif previous_price is not None:
            try:
                previous_price = float(previous_price)
            except ValueError:
                previous_price = None
        product = await db.update_product(
            id=id,
            name=name,
            description=description,
            price=price,
            image_path=file_path,
            sub_category_id=sub_category_id,
            expiration=expiration,
            is_available=is_available,
            amount=amount,
            units_of_measure=units_of_measure,
            compound=compound,
            storage=storage,
            manufacturer=manufacturer,
            previous_price=previous_price
        )
        return jsonable_encoder(ProductRead.model_validate(product))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.put("/product_contains", response_model=ProductRead)
async def update_product_contains(product_contains: ProductContainsUpdate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        product = await db.update_product_contains(
            id=product_contains.id,
            amount=product_contains.amount,
            name=product_contains.name
        )
        return jsonable_encoder(ProductRead.model_validate(product))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))

@r.delete("/product_contains", response_model=ProductRead)
async def delete_product_contains(id: int):
    try:
        return await db.delete_product_contains(id=id)
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.post("/product_tag", response_model=ProductRead)
async def add_product_tag(product_tag: TagCreate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        product = await db.add_tag(
            name=product_tag.name,
            first_color=product_tag.first_color,
            second_color=product_tag.second_color,
            product_id=product_tag.product_id
        )
        return jsonable_encoder(ProductRead.model_validate(product))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.put("/product_tag", response_model=ProductRead)
async def update_product_tag(product_tag: TagUpdate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        product = await db.update_tag(
            id=product_tag.id,
            name=product_tag.name,
            first_color=product_tag.first_color,
            second_color=product_tag.second_color
        )
        return jsonable_encoder(ProductRead.model_validate(product))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.delete("/product_tag", response_model=ProductRead)
async def delete_product_tag(id: int):
    try:
        return await db.delete_tag(id=id)
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

