from asyncio import sleep
from aiogram import Router, F, Bot
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery

from bot.curiers_callbacks import curier
from bot.sender import Sender
from bot.keyboards import Keyboards
from config import MANAGERS_IDS
from database.engine import Database
from bot.fsm import FSM

r = Router()

request_messages = []

@r.callback_query(F.data == 'register_start')
async def register(call: CallbackQuery, sender: Sender, kb: Keyboards, db: Database):
    cities = await db.get_cities()
    await sender.sm(
        message_id=call.message.message_id,
        text='<b>🏙  Выберите ваш город</b>\n'
             '<i>⚠  Внимание! После выбора города, вы не сможете изменить его без подтверждения</i>',
        chat_id=call.message.chat.id,
        reply_markup=kb.register_cities_kb(cities=cities)
    )

@r.callback_query(F.data.startswith('register_city_'))
async def register_city(call: CallbackQuery, sender: Sender, kb: Keyboards, db: Database, state: FSMContext):
    try:
        city_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  ValueError: Неправильный аргумент city_id в register_city: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  IndexError: Неправильный аргумент city_id в register_city: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    city = await db.get_city(id=city_id)
    if not city:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Город {city_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    text = (
        f'<b>🏙  Выбранный город: {city.name}\n\n'
        f'✏  Введите ваше имя</b>'
    )
    await state.clear()
    await state.update_data(city_id=city_id, message_id=call.message.message_id)
    await state.set_state(FSM.set_register_name)

    await sender.sm(
        message_id=call.message.message_id,
        text=text,
        chat_id=call.message.chat.id,
        reply_markup=kb.register_name_kb(
            name=call.message.chat.first_name.replace('_', ' '),
        )
    )

@r.callback_query(F.data.startswith('register_name_'))
async def register_name(call: CallbackQuery, sender: Sender, kb: Keyboards, db: Database, state: FSMContext):
    try:
        name = call.data.split('_')[2]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  ValueError: Неправильный аргумент name в register_name: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    await state.update_data(name=name, message_id=call.message.message_id)

    data = await state.get_data()

    try:
        city_id = data['city_id']
    except KeyError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  KeyError: Нет city_id в state',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        city_id = int(city_id)
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  ValueError: Неправильный city_id в state',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    city = await db.get_city(id=city_id)
    if not city:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Город {city_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    text = (
        f'<b>🏙  Выбранный город: {city.name}\n'
        f'👤  Ваше имя: {name}\n\n'
        f'📲✏  Введите ваш номер телефона</b>'
    )

    await state.set_state(FSM.set_register_phone)

    await sender.sm(
        message_id=call.message.message_id,
        text=text,
        chat_id=call.message.chat.id,
        reply_markup=kb.back(to=f'register_city_{city_id}')
    )

@r.callback_query(F.data.startswith('send_request_'))
async def send_request(call: CallbackQuery, sender: Sender, kb: Keyboards, db: Database, state: FSMContext):
    try:
        city_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  ValueError: Неправильный аргумент city_id в send_request: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  IndexError: Неправильный аргумент city_id в send_request: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    city = await db.get_city(id=city_id)
    if not city:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Город {city_id} не найден',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        name = call.data.split('_')[3]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  IndexError: Неправильный аргумент name в send_request: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        phone = call.data.split('_')[4]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  IndexError: Неправильный аргумент phone в send_request: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    request = await db.add_request(
        name=name,
        phone_number=phone,
        city_id=city_id,
        telegram_id=call.message.chat.id,
        username=call.message.chat.username
    )

    for manager_id in MANAGERS_IDS:
        await sleep(0.1)
        data = await sender.sm(
            text=f'<b>📩  Новая заявка\n'
                 f'🏙  Город: {city.name}\n'
                 f'👤  Имя: {name}\n'
                 f'📲  Телефон: {phone}</b>',
            chat_id=manager_id,
            reply_markup=kb.request_action_kb(request_id=request.id)
        )
        request_messages.append({'chat_id': manager_id, 'message_id': data.message_id, 'request_id': request.id})

    await sender.sm(
        message_id=call.message.message_id,
        text=f'<b>📩✅  Заявка была успешно отправлена</b>',
        chat_id=call.message.chat.id,
        reply_markup=kb.back_to_main_kb()
    )
    await state.clear()

@r.callback_query(F.data.startswith('request_'))
async def request_action(call: CallbackQuery, db: Database, sender: Sender, kb: Keyboards, bot: Bot):
    try:
        request_id = int(call.data.split('_')[2])
    except ValueError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный telegram_id в request_action: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный telegram_id в request_action: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        action = call.data.split('_')[1]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный action в request_action: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    request = await db.get_request(id=request_id)

    if not request:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Заявка {request_id} не найдена',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    if action == 'accept':

        await db.update_request(id=request_id, is_accepted=True)

        await sender.sm(
            message_id=call.message.message_id,
            text=f'✅  Заявка #{request_id} была принята',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

        await db.add_curier(
            full_name=request.name,
            phone_number=request.phone_number,
            city_id=request.city_id,
            telegram_id=request.telegram_id,
            username=request.username
        )

        await sender.sm(
            text=f'✅  Ваша заявка была принята! При выходе в меню, вам будут открыты новые действия',
            chat_id=request.telegram_id,
            reply_markup=kb.back_to_main_kb()
        )

        for el in request_messages:
            if el['request_id'] == request_id:
                await sleep(0.1)
                await bot.delete_message(chat_id=el['chat_id'], message_id=el['message_id'])
                request_messages.remove(el)

    elif action == 'decline':

        await db.update_request(id=request_id, is_accepted=False)

        await sender.sm(
            message_id=call.message.message_id,
            text=f'❌  Заявка #{request_id} была отклонена',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

        await sender.sm(
            message_id=call.message.message_id,
            text=f'❌  Ваша заявка была отклонена! С вами свяжутся в ближайшее время',
            chat_id=request.telegram_id,
            reply_markup=kb.back_to_main_kb()
        )

        for el in request_messages:
            if el['request_id'] == request_id:
                await sleep(0.1)
                await bot.delete_message(chat_id=el['chat_id'], message_id=el['message_id'])
                request_messages.remove(el)