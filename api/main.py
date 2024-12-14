from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from uvicorn.server import Server, Config
from asyncio import new_event_loop
from config import API_HOST, API_PORT
from database.schema import Admin
from database.engine import Database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_routers():
    from api.routers.main import r as main_router
    from api.routers.admin.main import r as admin_router
    from api.routers.user.main import r as user_router
    app.include_router(main_router)
    app.include_router(user_router)
    app.include_router(admin_router)

app.mount(path='/assets', app=StaticFiles(directory="./frontend/dist/assets"), name="assets")
app.mount(path='/static', app=StaticFiles(directory="static"), name="static")

config = Config(app=app, host=API_HOST, port=API_PORT)
server = Server(config=config)
db = Database()
load_routers()


async def main():
    await db.create_db_and_tables()
    from database.fill_database import fill_cities, fill_database, add_statuses, add_priorities, add_tax_delivery_cost
    try:
        await add_tax_delivery_cost()
    except Exception as e:
        print(e)
    try:
        await add_statuses()
    except Exception as e:
        print(e)
    try:
        await fill_cities()
    except Exception as e:
        print(e)
    try:
        await fill_database()
    except Exception as e:
        print(e)
    try:
        await add_priorities()
    except Exception as e:
       print(e)


    await server.serve()


if __name__ == "__main__":
    new_event_loop().run_until_complete(main())