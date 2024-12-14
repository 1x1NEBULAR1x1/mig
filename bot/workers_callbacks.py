from aiogram import Router, F
from aiogram.types import CallbackQuery
from bot.curiers_callbacks import curier
from bot.orders_callbacks import order_products
from bot.sender import Sender
from bot.keyboards import Keyboards
from database.engine import Database


r = Router()

async def get_order_info(order_id: int, db: Database) -> str:
    order = await db.get_order(id=order_id)
    address = await db.get_user_address(id=order.address_id)
    user = await db.get_user(id=order.user_id)
    text = f'<b>⏳  Ваш текущий заказ №{order.id}: \n\n'
    text += (f'🌎  Адрес: {address.street} д. {address.house} под. {address.entrance} кв. {address.flat} '
             f'эт. {address.floor}\n')
    text += f'👤  Имя получателя: {user.name if user.name else "Не указано"}\n'
    if address.comment:
        text += f'💭  Комментарий: {address.comment}\n'
    text += f'🕓  Установленное время: {order.time_to_delivery}\n\n'
    text += f'🧾  Список товаров:'
    order_products = await db.get_order_products(order_id=order_id)
    order_products = sorted(order_products, key=lambda x: x.branch_id, reverse=True)
    prev_branch_id = None
    branch = await db.get_branch(id=order_products[0].branch_id)
    text += (f'\n\n💠  Точка №{branch.id}  "{branch.name}" - {branch.address.street} '
             f'д. {branch.address.house}\n\n')
    for order_product in order_products:
        if prev_branch_id != order_product.branch_id and prev_branch_id is not None:
            branch = await db.get_branch(id=order_product.branch_id)
            text += (f'\n💠  Точка №{branch.id}  "{branch.name}" - {branch.address.street} '
                     f'д. {branch.address.house}\n\n')
        text += (f' - №{order_product.product_id} {order_product.product.name} : '
                 f'{order_product.amount} ед.\n')
        prev_branch_id = order_product.branch_id

    text += '</b>'

    return text

@r.callback_query(F.data.startswith('worker_edit_'))
async def worker_edit(call: CallbackQuery, sender: Sender, kb: Keyboards, db: Database):
    worker = await db.get_curier(telegram_id=call.message.chat.id)
    if worker is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text='⚠  Ваши данные были повреждены. Сообщите о проблеме менеджеру',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        param = call.data.split('_')[2]
        value = call.data.split('_')[3]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  IndexError: Неправильный аргумент в worker_edit: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    if param == 'is-available':

        curier = await db.update_curier(id=worker.id, is_available=value == 'True')

        await sender.sm(
            message_id=call.message.message_id,
            text=f'👁‍🗨  Ваш статус был обновлён: {"✅ Свободен" if curier.is_available else "💤 Занят"}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    else:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент в worker_edit: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

@r.callback_query(F.data == 'worker_order')
async def worker_order(call: CallbackQuery, sender: Sender, kb: Keyboards, db: Database):
    curier = await db.get_curier(telegram_id=call.message.chat.id)
    if not curier:
        return await sender.sm(
            message_id=call.message.message_id,
            text='⚠  Ваши данные были повреждены. Сообщите о проблеме менеджеру',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    if not curier.order:
        return await sender.sm(
            message_id=call.message.message_id,
            text='💭  <b>На вашем аккаунте нет активного заказа</b>',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(id=curier.order.id)

    if not order:
        return await sender.sm(
            message_id=call.message.message_id,
            text='⚠  Данные заказа были повреждены. Сообщите о проблеме менеджеру',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    text = await get_order_info(order_id=order.id, db=db)

    await sender.sm(
        message_id=call.message.message_id,
        text=text,
        chat_id=call.message.chat.id,
        reply_markup=kb.back_to_main_kb()
    )