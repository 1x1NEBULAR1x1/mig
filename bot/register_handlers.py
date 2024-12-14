import re
from aiogram import Router, F
from aiogram.types import Message
from bot.sender import Sender
from bot.keyboards import Keyboards
from database.engine import Database
from bot.fsm import FSM
from aiogram.fsm.context import FSMContext

r = Router()

async def check_message_id(data: dict) -> int:
    try:
        message_id = data['message_id']
    except KeyError:
        return await sender.sm(
            text='⚠  KeyError: message_id в set_register_name',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        message_id = int(message_id)
        return message_id
    except ValueError:
        return await sender.sm(
            text='⚠  ValueError: message_id в set_register_name',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

async def check_city_id(data: dict, message_id: int) -> int:
    try:
        city_id = data['city_id']
    except KeyError:
        return await sender.sm(
            message_id=message_id,
            text='⚠  KeyError: city_id в set_register_name',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        city_id = int(city_id)
        return city_id
    except ValueError:
        return await sender.sm(
            message_id=message_id,
            text='⚠  ValueError: city_id в set_register_name',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )



@r.message(FSM.set_register_name)
async def set_register_name(message: Message, sender: Sender, db: Database, kb: Keyboards, state: FSMContext):
    await message.delete()

    data = await state.get_data()
    name = message.text
    await state.update_data(name=name)

    message_id = await check_message_id(data=data)

    city_id = await check_city_id(data=data, message_id=message_id)

    city = await db.get_city(id=city_id)

    if not city:
        return await sender.sm(
            message_id=message_id,
            text=f'⚠  Город {city_id} не найден',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    text = (
        f'<b>🏙  Выбранный город: {city.name}\n'
        f'👤  Ваше имя: {name}\n\n'
        f'📲✏  Введите ваш номер телефона</b>'
    )

    await state.set_state(FSM.set_register_phone)

    await sender.sm(
        message_id=message_id,
        text=text,
        chat_id=message.chat.id,
        reply_markup=kb.back(to=f'register_city_{city_id}')
    )

@r.message(FSM.set_register_phone)
async def set_register_phone(message: Message, sender: Sender, db: Database, kb: Keyboards, state: FSMContext):
    await message.delete()

    data = await state.get_data()
    phone = message.text

    message_id = await check_message_id(data=data)

    city_id = await check_city_id(data=data, message_id=message_id)

    case = bool(re.match(r'^\+?\d{1,4}?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$', phone))

    if not case:

        await state.set_state(FSM.set_register_phone)

        return await sender.sm(
            message_id=message_id,
            text='⚠  Введите корректный номер телефона',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )


    await state.update_data(phone=phone)

    city = await db.get_city(id=city_id)

    if not city:
        return await sender.sm(
            message_id=message_id,
            text=f'⚠  Город {city_id} не найден',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    text = (
        f'<b>🏙  Выбранный город: {city.name}\n'
        f'👤  Ваше имя: {data["name"]}\n'
        f'📲  Ваш номер телефона: {phone}</b>\n\n'
        f'❔  Отправить заявку на регистрацию?'
    )

    data = await state.get_data()

    if not data.get('name') or not data.get('phone') or not data.get('city_id'):
        return await sender.sm(
            message_id=message_id,
            text='⚠  Данные в форме были утрачены, пожалуйста, повторите попытку',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    await sender.sm(
        message_id=message_id,
        text=text,
        chat_id=message.chat.id,
        reply_markup=kb.send_request_kb(data=data)
    )