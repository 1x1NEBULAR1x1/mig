from asyncio import sleep

from database.engine import Database
from database.schema import Order
from bot.sender import Sender
from config import MANAGERS_IDS
from bot.main import bot
from bot.keyboards import Keyboards
from bot.orders_callbacks import get_order_info
from geopy.distance import geodesic
from geopy.geocoders import Nominatim

def get_lat_long(address):
    """
    Get latitude and longitude for a given address.
    """
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.geocode(address)
    if location:
        return location.latitude, location.longitude
    else:
        raise ValueError(f"Address not found: {address}")

def calculate_distance(coord1, coord2):
    return geodesic(coord1, coord2).meters

sender = Sender(bot=bot)

db = Database()

kb = Keyboards()

async def get_delivery_price_(city_name: str, lat: float, lon: float) -> float:
    city = await db.get_city(name=city_name)
    branches = await db.get_branches(city_id=city.id)
    dists = []
    for branch in branches:
        dist = calculate_distance(coord1=[lat, lon],
                                  coord2=[branch.address.latitude, branch.address.longitude])
        dists.append(dist)
    min_ = min(dists)
    sum_ = min_ * 2 / 1.5
    sum_ = sum_ / 100
    delivery_price = await db.get_delivery_price()
    return float(delivery_price.start_price) + (sum_ * float(delivery_price.cost_per_100m))

async def send_order_request(order: Order) -> bool:
    text = await get_order_info(order_id=order.id, db=db)
    for manager_id in MANAGERS_IDS:
        try:
            await sleep(0.5)
            await sender.sm(
                chat_id=manager_id,
                text=text,
                reply_markup=kb.order_kb(order=order),
            )
        except Exception:
            pass