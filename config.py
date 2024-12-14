from dotenv import load_dotenv
from os import getenv

load_dotenv()

SECRET_KEY = getenv("SECRET_KEY")
if not SECRET_KEY:
    exit("No secret key provided")

BOT_TOKEN = getenv("BOT_TOKEN")
if not BOT_TOKEN:
    exit("No bot token provided")

MANAGERS_IDS = getenv("MANAGERS_IDS")
if not MANAGERS_IDS:
    exit("No meagers ids provided")

try:
    MANAGERS_IDS = [int(id) for id in MANAGERS_IDS.split(" ")]
except ValueError:
    exit("Invalid meagers ids provided")

DATABASE_URL = getenv("DATABASE_URL")
if not DATABASE_URL:
    exit("No database url provided")

try:
    API_PORT = int(getenv("API_PORT"))
except ValueError:
    exit("Invalid api port provided")
if not API_PORT:
    print("No API_PORT provided, defaulting to 80")
    API_PORT = 80

API_HOST = getenv("API_HOST")
if not API_HOST:
    print("No API_HOST provided, defaulting to 127.0.0.1")
    API_HOST = "127.0.0.1"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 3600
