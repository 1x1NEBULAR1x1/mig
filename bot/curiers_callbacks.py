from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery
from database.engine import Database
from database.schema import Curier
from bot.sender import Sender
from bot.keyboards import Keyboards
from bot.fsm import FSM

r = Router()

async def get_curier_info(curier_id: int, db: Database) -> str:

    curier = await db.get_curier(id=curier_id)

    city = await db.get_city(id=curier.city_id)

    text = (
        f"<b>🚚💠 ID: {curier.id}\n"
        f"🌎  Город: {city.name}\n"
        f"👤  Имя: {curier.full_name}\n"
        f"📲  Телефон: {curier.phone_number}\n"
    )

    if curier.username:
        text += f"🌐  Юзернейм: @{curier.username}\n"

    text += (
        f"💠  Телеграм ID: {curier.telegram_id}\n"
        f"👁‍🗨  Статус: {'❌ Забанен' if curier.is_banned else '✅ Свободен' if curier.is_available else '💼 Занят'}\n"
        f"💰  Баланс: {curier.balance} ₽\n\n"
    )

    if curier.order is not None:
        text += f"📌  Текущий заказ: №{curier.order.id}\n"

    text += '</b>'

    return text

@r.callback_query(F.data.startswith('curiers_cities_'))
async def curiers_cities(call: CallbackQuery, db: Database, sender: Sender, kb: Keyboards):
    try:
        page = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  ValueError: Неправильный аргумент page в curiers_cities: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  IndexError: Неправильный аргумент page в curiers_cities: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    cities = await db.get_cities(page=page)
    await sender.sm(
        message_id=call.message.message_id,
        text='✏🌐 Выберите город',
        chat_id=call.message.chat.id,
        reply_markup=kb.curiers_cities_kb(cities=cities)
    )

@r.callback_query(F.data.startswith('curiers_list_'))
async def curiers_list(call: CallbackQuery, db: Database, sender: Sender, kb: Keyboards):
    try:
        city_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный city_id в curiers_list: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    city = await db.get_city(id=city_id)
    if city is None:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Город {city_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    curiers = await db.get_curiers(city_id=city_id)
    await sender.sm(
        message_id=call.message.message_id,
        text='🧾🚚 Список курьеров',
        chat_id=call.message.chat.id,
        reply_markup=kb.curiers_list_kb(curiers=curiers, city_id=city_id)
    )

@r.callback_query(F.data.startswith('curier_balance_'))
async def curier_balance(call: CallbackQuery, db: Database, sender: Sender, kb: Keyboards, state: FSMContext):
    try:
        curier_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный curier_id в curier_balance: {call.data}',
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

    await state.update_data(curier_id=curier_id, message_id=call.message.message_id)
    await state.set_state(FSM.set_curier_balance)

    await sender.sm(
        message_id=call.message.message_id,
        text=f'💰  Баланс курьера: {curier.balance} ₽\n\n✏  Введите новый баланс',
        chat_id=call.message.chat.id,
        reply_markup=kb.curier_balance_kb(curier_id=curier.id)
    )

@r.callback_query(F.data.startswith('curier_city_'))
async def curier_city(call: CallbackQuery, db: Database, sender: Sender, kb: Keyboards):
    try:
        curier_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный curier_id в curier_city: {call.data}',
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

    cities = await db.get_cities()

    await sender.sm(
        message_id=call.message.message_id,
        text='✏🌐 Выберите новый город курьера',
        chat_id=call.message.chat.id,
        reply_markup=kb.curier_city_kb(cities=cities, curier_id=curier_id)
    )

@r.callback_query(F.data.startswith('curier_edit_'))
async def curier_edit(call: CallbackQuery, db: Database, sender: Sender, kb: Keyboards, state: FSMContext):
    try:
        curier_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный curier_id в curier_edit: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    param = call.data.split('_')[3]

    data = call.data.split('_')[4]

    if param == 'city-id':
        try:
            city_id = int(data)
        except ValueError:
            return await sender.sm(
                message_id=call.message.message_id,
                text=f'⚠  Неправильный city_id в curier_edit: {call.data}',
                chat_id=call.message.chat.id,
                reply_markup=kb.back_to_main_kb()
            )

        curier = await db.update_curier(id=curier_id, city_id=city_id)

        await sender.sm(
            message_id=call.message.message_id,
            text=f'✅✏ Город курьера обновлен\n{await get_curier_info(curier_id=curier_id, db=db)}',
            chat_id=call.message.chat.id,
            reply_markup=kb.curier_kb(curier=curier)
        )

    elif param == 'is-banned':
        curier = await db.update_curier(id=curier_id, is_banned=data == 'True')
        await sender.sm(
            message_id=call.message.message_id,
            text=f'✅✏ Курьер обновлен\n{await get_curier_info(curier_id=curier_id, db=db)}',
            chat_id=call.message.chat.id,
            reply_markup=kb.curier_kb(curier=curier)
        )

    else:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный param в curier_edit: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )



@r.callback_query(F.data.startswith('curier_'))
async def curier(call: CallbackQuery, db: Database, sender: Sender, kb: Keyboards, state: FSMContext):
    await state.clear()
    try:
        curier_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный curier_id в curier: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный curier_id в curier: {call.data}',
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

    text = await get_curier_info(curier_id=curier_id, db=db)

    await sender.sm(
        message_id=call.message.message_id,
        text=text,
        chat_id=call.message.chat.id,
        reply_markup=kb.curier_kb(curier=curier)
    )




