from fastapi import APIRouter, Request, Response
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
import jwt
from config import SECRET_KEY
from datetime import datetime, timedelta
from database.engine import Database
from twilio.rest import Client
from api.models.user import UserCreate, UserRead
import random
from database.schema import User
from api.routers.access_token import create_access_token, check_user_token

db = Database()

TWILIO_ACCOUNT_SID = "ACcc6b64200bdeb3d9655afa44cbe9ebd3"
TWILIO_AUTH_TOKEN = "e3e090702d784682d5467c5010d26146"
TWILIO_PHONE_NUMBER = "+13135280791"
ALGORITHM = "HS256"


client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

r = APIRouter(prefix="/user", tags=["User"])

@r.post("/get-me/")
async def get_me(token: str):
    try:
        user = await check_user_token(token=token)
        if not user:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        return JSONResponse(status_code=200, content=jsonable_encoder(UserRead.model_validate(user)))

    except Exception as e:
        raise e
        return JSONResponse(status_code=202, content={"error": str(e)})



@r.post("/send-verification-code/")
async def send_verification_code(phone_number: str):
    try:
        otp = random.randint(100000, 999999)
        await db.add_code(phone_number=phone_number, code=otp, expiration=timedelta(minutes=5))
        return JSONResponse(status_code=200, content={"message": "ok"})

    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content={"error": str(e)})

class LoginData(BaseModel):
    phone_number: str
    verify_code: int = Field(ge=0, le=999999)

@r.post("/verify-phone/")
async def verify_phone(data: LoginData, response: JSONResponse):
    try:
        result = await db.use_code(phone_number=data.phone_number, code=data.verify_code)
        if not result:
            return JSONResponse(status_code=401, content={"error": "Invalid data"})

        access_token = create_access_token(data={"sub": data.phone_number})

        response.set_cookie(key="access_token", value=access_token)

        return {"message": "Phone number verified successfully", "access_token": access_token}
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content={"error": str(e)})

@r.post("/verify-phone-mobile/")
async def verify_phone_mobile(phone_number: str, code: int):
    try:
        result = await db.use_code(phone_number=phone_number, code=code)
        if not result:
            return JSONResponse(status_code=401, content={"error": "Invalid data"})

        access_token = create_access_token(data={"sub": phone_number})

        return {"message": "Phone number verified successfully", "access_token": access_token}
    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content={"error": str(e)})


@r.get("/protected/")
async def protected_route(request: Request):
    try:
        token = request.cookies.get("access_token")
        if token is None:
            return JSONResponse(
                status_code=401,
                content={"message": "No access token"},
            )

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            phone_number: str = payload.get("sub")
            if phone_number is None:
                return JSONResponse(status_code=401, content={"message": "Invalid token"})
        except jwt.PyJWTError:
            return JSONResponse(status_code=401, content={"message": "Invalid token"})

        return {"phone_number": phone_number}

    except Exception as e:
        print(e)
        return JSONResponse(status_code=202, content={"error": str(e)})