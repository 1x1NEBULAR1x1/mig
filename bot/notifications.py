from bot.keyboards import Keyboards
from bot.sender import Sender
from database.schema import Curier, Order
from database.engine import Database

async def on_set_curier(order: Order, curier: Curier, sender: Sender, kb: Keyboards):
    text = (
        f'💬✅  <b>Вам назначена доставка</b>\n\n'
    )

    db = Database()
    from bot.workers_callbacks import get_order_info
    text += await get_order_info(order_id=order.id, db=db)

    await sender.sm(
        text=text,
        chat_id=curier.telegram_id,
        reply_markup=kb.back_to_main_kb()
    )

async def on_delete_curier(order: Order, curier: Curier, sender: Sender, kb: Keyboards):

    await sender.sm(
        text=f'❌💬  <b>Ваша доставка заказа №{order.id} была отменена</b>\n',
        chat_id=curier.telegram_id,
        reply_markup=kb.back_to_main_kb()
    )