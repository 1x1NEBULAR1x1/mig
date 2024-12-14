from datetime import datetime, timedelta
import jwt
from capitalcom.config import password
from fastapi import Request
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from database.engine import Database
from database.schema import User, Admin

db = Database()

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def check_user_token(request: Request = None, token: str = None) -> User | bool:
    if request:
        token = request.cookies.get("access_token")
    if token is None:
        return False
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone_number: str = payload.get("sub")
        if phone_number is None:
            return False
        user = await db.get_user(phone_number=phone_number)
        if user is None:
            return False
        return user
    except jwt.PyJWTError:
        return False

async def check_admin_token(request: Request) -> Admin | bool:
    token = request.cookies.get("admin_token")
    if token is None:
        return False
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        password: str = payload.get("pass")
        if login is None or password is None:
            return False
        admin = await db.login_admin(login=login, password=password)
        if admin is None:
            return False
        return admin
    except jwt.PyJWTError:
        return False
