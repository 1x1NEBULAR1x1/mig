from pydantic import BaseModel
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse

from api.models.address import BranchAddressRead, BranchAddressUpdate
from api.models.branch import BranchProductRead, BranchProductUpdate, BranchRead, BranchCreate
from database.engine import Database
from api.routers.access_token import check_admin_token

r = APIRouter(prefix="", tags=["Admin"])
db = Database()

@r.get("/branch/{id}/catalog")
async def get_branch_catalog(request: Request, id: int):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        branch = await db.get_branch_products_with_categories(branch_id=id)
        return JSONResponse(status_code=200, content=jsonable_encoder(branch))
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content=str(e))


class BranchProduct(BaseModel):
    amount: int
    product_id: int
    is_available: bool

@r.post('/branch/{branch_id}/product')
async def add_branch_product(request: Request, branch_id: int, product: BranchProduct):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        product = await db.add_branch_product(branch_id=branch_id, product_id=product.product_id, amount=product.amount, is_available=product.is_available)
        return JSONResponse(status_code=200, content=jsonable_encoder(product))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.get('/branch_product/{id}', response_model=BranchProductRead)
async def get_branch_product(id: int):
    try:
        product = await db.get_branch_product(id=id)
        return JSONResponse(status_code=200, content=jsonable_encoder(BranchProductRead.model_validate(product)))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.put('/branch_product/', response_model=BranchProductRead)
async def update_branch_product(product: BranchProductUpdate):
    try:
        product = await db.update_branch_product(id=product.id, amount=product.amount, is_available=product.is_available)
        return JSONResponse(status_code=200, content=jsonable_encoder(BranchProductRead.model_validate(product)))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.delete('/branch_product/{id}')
async def delete_branch_product(id: int):
    try:
        is_success = await db.delete_branch_product(id=id)
        return JSONResponse(status_code=200, content={"is_success": is_success})
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.put('/branch', response_model=BranchRead)
async def update_branch(branch: BranchRead, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        address = await db.update_branch_address(
            id=branch.address.id,
            city_id=branch.address.city_id,
            street=branch.address.street,
            house=branch.address.house,
            flat=branch.address.flat,
            longitude=branch.address.longitude,
            latitude=branch.address.latitude,
            entrance=branch.address.entrance,
            floor=branch.address.floor,
            comment=branch.address.comment
        )
        branch = await db.update_branch(
            id=branch.id,
            name=branch.name,
            description=branch.description,
            address_id=address.id,
            is_available=branch.is_available
        )
        return JSONResponse(status_code=200, content=jsonable_encoder(BranchRead.model_validate(branch)))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))

@r.post('/branch', response_model=BranchRead)
async def create_branch(branch: BranchCreate, request: Request):
    try:
        admin = await check_admin_token(request)
        if not admin:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        address = await db.add_branch_address(
            city_id=branch.address.city_id,
            street=branch.address.street,
            house=branch.address.house,
            flat=branch.address.flat,
            longitude=branch.address.longitude,
            latitude=branch.address.latitude,
            entrance=branch.address.entrance,
            floor=branch.address.floor,
            comment=branch.address.comment
        )
        branch = await db.add_branch(
            name=branch.name,
            description=branch.description,
            address_id=address.id,
            is_available=branch.is_available,
            city_id=branch.address.city_id
        )
        return JSONResponse(status_code=200, content=jsonable_encoder(BranchRead.model_validate(branch)))
    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content=str(e))
