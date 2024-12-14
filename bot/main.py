from asyncore import dispatcher

from aiogram import Bot, Dispatcher
from aiogram.client.bot import DefaultBotProperties
from bot.handlers import r as handlers
from bot.orders_callbacks import r as orders_callbacks
from bot.curiers_callbacks import r as curiers_callbacks
from bot.reports_callbacks import r as reports_callbacks
from bot.register_handlers import r as register_handlers
from bot.workers_callbacks import r as workers_callbacks
from bot.register_callbacks import r as register_callbacks
from asyncio import new_event_loop
from config import BOT_TOKEN
from database.engine import Database
from bot.sender import Sender
from bot.keyboards import Keyboards

dp = Dispatcher()

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties())

sender = Sender(bot=bot)
kb = Keyboards()

async def on_startup():
    print('Bot is started')

dp.startup.register(on_startup)

def load_handlers(dispatcher: Dispatcher):
    dispatcher.include_router(handlers)
    dispatcher.include_router(orders_callbacks)
    dispatcher.include_router(curiers_callbacks)
    dispatcher.include_router(reports_callbacks)
    dispatcher.include_router(register_handlers)
    dispatcher.include_router(register_callbacks)
    dispatcher.include_router(workers_callbacks)

async def on_shutdown():
    print('Bot is stopped')

async def main():
    db = Database()
    load_handlers(dp)
    try:
        await dp.start_polling(bot, db=db, sender=sender, kb=kb)
    except Exception as e:
        print(e)
    finally:
        await bot.session.close()


if __name__ == '__main__':
    new_event_loop().run_until_complete(main())