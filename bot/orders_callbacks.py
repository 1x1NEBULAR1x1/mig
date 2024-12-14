from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery
from bot.curiers_callbacks import curier
from bot.notifications import on_set_curier, on_delete_curier
from config import MANAGERS_IDS
from database.engine import Database
from bot.sender import Sender
from bot.keyboards import Keyboards
from bot.fsm import FSM

r = Router()

async def get_order_info(db: Database, order_id: int) -> str:

    order = await db.get_order(id=order_id)

    city = await db.get_city(order.address.city_id)

    priorities = await db.get_order_priorities()

    prioritiy_price = 0

    for p in priorities:
        if p.id == order.priority_id:
            prioritiy_price = p.extra_cost * order.total_price / 100

    total_price = order.total_price + prioritiy_price + order.curier_tips + order.delivery_price

    text = (
        f"<b>💠 Заказ №: {order.id}\n\n"
        "👤 Пользователь:\n"
        f"💠 ID: {order.user_id} (📲 Телефон: {order.user.phone_number})\n"
        f"📬 Адрес доставки: {city.name}, ул. {order.address.street}, дом {order.address.house}, "
        f"п. {order.address.entrance}, "
        f"кв. {order.address.flat}, эт. {order.address.floor}\n\n"
        f"💳 Метод оплаты: {order.payment_method}\n"
        f"🌐 Стоимость доставки: {order.delivery_price:.2f} ₽\n"
        f"⚡ Дополнительная плата за скорость доставки: {prioritiy_price:.2f} ₽\n"
        f"💸 Чаевые курьеру: {order.curier_tips:.2f} ₽\n"
        f'🛒 Стоимость корзины: {order.total_price:.2f} ₽\n'
        f"💰 Общая стоимость: {total_price:.2f} ₽\n"
        f"🚚 Курьер: {f'ID: {order.curier_id} - {order.curier.full_name}' if order.curier else 'не назначен'}\n"
        f"👁‍🗨 Статус заказа: {order.status.full_status}\n"
        f"⚡ Приоритет: {order.priority.name}\n"
        f"⏳ Ожидаемое время доставки: {order.time_to_delivery or 'не указано'}"
        "</b>"
    )

    return text

@r.callback_query(F.data.startswith('order_time_'))
async def order_time(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards, state: FSMContext):
    try:
        order_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_time: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_time: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    try:
        from_ = call.data.split('_')[3]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order_time: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    await state.set_state(FSM.set_order_time)
    await state.update_data(order_id=order_id, from_=from_, message_id=call.message.message_id)
    await sender.sm(
        message_id=call.message.message_id,
        text='🕓✏  <b>Введите время доставки заказа</b>',
        chat_id=call.message.chat.id,
        reply_markup=kb.order_time_kb(from_=from_, order_id=order_id)
    )

@r.callback_query(F.data.startswith('orders_cities_'))
async def orders_cities(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        from_ = call.data.split('_')[2]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в orders_cities: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    cities = await db.get_cities()
    await sender.sm(
        message_id=call.message.message_id,
        text='✏🌐 Выберите город',
        chat_id=call.message.chat.id,
        reply_markup=kb.orders_cities_kb(cities=cities, from_=from_)
    )

@r.callback_query(F.data.startswith('orders_city_'))
async def ordes_city(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        from_ = call.data.split('_')[3]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в orders_city: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        city_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент city_id в orders_city: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    if from_ == 'history':
        orders = await db.get_orders(city_id=city_id, page=0, statuses_ids=[0, 5])
        await sender.sm(
            message_id=call.message.message_id,
            text="🧾  История заказов",
            chat_id=call.message.chat.id,
            reply_markup=kb.active_orders_kb(orders=orders, city_id=city_id)
        )

    elif from_ == 'active':
        orders = await db.get_orders(city_id=city_id, not_status_ids=[0, 5])
        await sender.sm(
            message_id=call.message.message_id,
            text="👁‍🗨  Список активных заказов",
            chat_id=call.message.chat.id,
            reply_markup=kb.active_orders_kb(orders=orders, city_id=city_id)
        )

@r.callback_query(F.data.startswith('active_orders_'))
async def active_orders(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        sorting = call.data.split('_')[3]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент sorting в active_orders: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    try:
        city_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент city_id в active_orders: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    try:
        page = int(call.data.split('_')[4])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент page в active_orders: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент page в active_orders: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    orders = await db.get_orders(not_status_ids=[0, 5], page=page, sorting=sorting, city_id=city_id)
    await sender.sm(
        message_id=call.message.message_id,
        text="👁‍🗨  Список активных заказов",
        chat_id=call.message.chat.id,
        reply_markup=kb.active_orders_kb(orders=orders, page=page, sorting=sorting, city_id=city_id)
    )

@r.callback_query(F.data.startswith('orders_history_'))
async def orders_history(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        sorting = call.data.split('_')[3]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент sorting в orders_history: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        city_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент city_id в orders_history: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        page = int(call.data.split('_')[4])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент page в orders_history: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    orders = await db.get_orders(page=page, sorting=sorting)

    await sender.sm(
        message_id=call.message.message_id,
        text="🖼🧾  История заказов",
        chat_id=call.message.chat.id,
        reply_markup=kb.orders_history_kb(orders=orders, page=page, sorting=sorting, city_id=city_id)
    )

@r.callback_query(F.data.startswith('order_accept_payment_'))
async def order_accept_payment(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        order_id = int(call.data.split('_')[3])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_accept_payment: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_accept_payment: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    try:
        from_ = call.data.split('_')[4]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order_accept_payment: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_accept_payment: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    await db.update_order(id=order.id, status_id=2, is_payment_accepted=True)
    await sender.sm(
        message_id=call.message.message_id,
        text="✅  Оплата подтверждена",
        chat_id=call.message.chat.id,
        reply_markup=kb.back_to_order_kb(order_id=order.id, from_=from_)
    )



@r.callback_query(F.data.startswith('order_change_status_'))
async def order_change_status(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        from_ = call.data.split('_')[4]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order_change_status: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    try:
        order_id = int(call.data.split('_')[3])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_change_status: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    statuses = await db.get_order_statuses()

    await sender.sm(
        message_id=call.message.message_id,
        text='👁‍🗨  Выберите статус для заказа',
        chat_id=call.message.chat.id,
        reply_markup=kb.order_change_status_kb(order_id=order.id, from_=from_, statuses=statuses)
    )

@r.callback_query(F.data.startswith('order_set_status_'))
async def order_set_status(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        from_ = call.data.split('_')[5]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order_set_status: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    try:
        status_id = int(call.data.split('_')[4])

    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент status_id в order_set_status: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        order_id = int(call.data.split('_')[3])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_set_status: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    status = await db.get_order_status(id=status_id)
    if status is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Статус {status_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    await db.update_order(status_id=status_id, id=order_id)
    await sender.sm(
        message_id=call.message.message_id,
        text=f'✅✏ Статус изменен на {status.full_status}\n{await get_order_info(db=db, order_id=order_id)}',
        chat_id=call.message.chat.id,
        reply_markup=kb.order_kb(order=order, from_=from_)
    )

@r.callback_query(F.data.startswith('order_change_curier_'))
async def order_change_curier(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        from_ = call.data.split('_')[4]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order_change_curier: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        order_id = int(call.data.split('_')[3])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_change_curier: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    curiers = await db.get_curiers(city_id=order.address.city_id, is_available=True)

    await sender.sm(
        message_id=call.message.message_id,
        text='👁‍🗨  Выберите курьера для заказа',
        chat_id=call.message.chat.id,
        reply_markup=kb.order_change_curier_kb(order_id=order.id, from_=from_, curiers=curiers)
    )

@r.callback_query(F.data.startswith('order_delete_curier_'))
async def order_delete_curier(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        from_ = call.data.split('_')[4]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order_delete_curier: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        order_id = int(call.data.split('_')[3])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_delete_curier: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    await on_delete_curier(order=order, curier=order.curier, sender=sender, kb=kb)

    order = await db.update_order(curier_id=-1, id=order_id)

    await sender.sm(
        message_id=call.message.message_id,
        text=f'✅✏ Курьер снят\n{await get_order_info(db=db, order_id=order_id)}',
        chat_id=call.message.chat.id,
        reply_markup=kb.order_kb(order=order, from_=from_)
    )

@r.callback_query(F.data.startswith('order_set_curier_'))
async def order_set_curier(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        from_ = call.data.split('_')[5]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order_set_curier: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        curier_id = int(call.data.split('_')[4])
        order_id = int(call.data.split('_')[3])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент curier_id или order_id в order_set_curier: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    curier = await db.get_curier(id=curier_id)
    if curier is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Курьер {curier_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.update_order(curier_id=curier_id, id=order_id)

    await on_set_curier(order=order, sender=sender, curier=curier, kb=kb)

    await sender.sm(
        message_id=call.message.message_id,
        text=f'✅✏ Назначен курьер: {curier.full_name}\n{await get_order_info(db=db, order_id=order_id)}',
        chat_id=call.message.chat.id,
        reply_markup=kb.order_kb(order=order, from_=from_)
    )

@r.callback_query(F.data.startswith('order_products_'))
async def order_products(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        from_ = call.data.split('_')[3]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order_products: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        order_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order_products: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order_products = await db.get_order_products(order_id=order_id)

    text = f'🧾 <b>Список товаров заказа №{order.id}:</b>\n\n'

    for order_product in order_products:
        text += f'📦 {order_product.product.name} - {order_product.amount} шт. - {order_product.branch.name}\n'

    await sender.sm(
        message_id=call.message.message_id,
        text=text,
        chat_id=call.message.chat.id,
        reply_markup=kb.back_to_order_kb(order_id=order.id, from_=from_)
    )

@r.callback_query(F.data.startswith('order_'))
async def order_data(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards, state: FSMContext):
    await state.clear()
    try:
        from_ = call.data.split('_')[2]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент from_ в order: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        order_id = int(call.data.split('_')[1])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент order_id в order: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(order_id)
    if order is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    await sender.sm(
        message_id=call.message.message_id,
        text=await get_order_info(db=db, order_id=order_id),
        chat_id=call.message.chat.id,
        reply_markup=kb.order_kb(order=order, from_=from_)
    )