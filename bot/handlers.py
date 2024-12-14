from aiogram import Router, Bot, F
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, CallbackQuery

from bot.curiers_callbacks import get_curier_info
from bot.workers_callbacks import get_order_info
from config import MANAGERS_IDS
from bot.sender import Sender
from database.engine import Database
from bot.keyboards import Keyboards
from bot.fsm import FSM

r = Router()


async def menu(message: Message, sender: Sender, kb: Keyboards, db: Database, state: FSMContext, message_id: int = None):
    await state.clear()
    if not message.chat.type == 'private':
        return await sender.sm(
            text='💭  <b>Для корректной работы бота и обратной связи, '
                 'вам необходимо использовать бота в личных сообщениях</b>',
            chat_id=message.chat.id
        )
    await state.clear()
    if message.chat.id in MANAGERS_IDS:
        return await sender.sm(
            message_id=message_id,
            text='💼  <b>Главное меню</b>',
            chat_id=message.chat.id,
            reply_markup=kb.main_kb()
        )

    request = await db.get_request(telegram_id=message.chat.id)

    if not request:

        if message.chat.username is None:
            return await sender.sm(
                message_id=message_id,
                text='💭  <b>Добро пожаловать. Для корректной работы бота и обратной связи, '
                     'вам необходимо установить юзернейм для аккаунта</b>',
                chat_id=message.chat.id
            )

        return await sender.sm(
            message_id=message_id,
            text='💭  <b>Добро пожаловать. Данный бот поможет вам зарегистрироваться как курьер. '
                 'Пройти регистрацию?</b>',
            chat_id=message.chat.id,
            reply_markup=kb.register_kb()
        )

    if request.is_accepted is None:
        return await sender.sm(
            message_id=message_id,
            text='💭  <b>Ваша заявка на регистрацию была отправлена, ожидается подтверждение</b>',
            chat_id=message.chat.id
        )

    if not request.is_accepted:
        return await sender.sm(
            message_id=message_id,
            text='❌  <b>Ваша заявка на регистрацию была отклонена. С вами свяжутся в ближайшее время</b>',
            chat_id=message.chat.id
        )

    if request.is_accepted:

        curier = await db.get_curier(telegram_id=message.chat.id)

        if curier is None:
            return await sender.sm(
                message_id=message_id,
                text=f'⚠  Ваши данные были повреждены. Сообщите о проблеме менеджеру',
                chat_id=message.chat.id
            )

        if curier.is_banned:
            return await sender.sm(
                message_id=message_id,
                text=f'⚠  Ваш аккаунт был заблокирован за нарушение правил. С вами свяжутся в ближайшее время',
                chat_id=message.chat.id
            )

        text = '💼  <b>Главное меню:\n'
        text += f'💰  Баланс: {curier.balance} ₽\n'
        text += (f'💠  Ваш статус:  '
                 f'{"✅ Свободен" if (curier.is_available and curier.order is None) else "💤 Занят"}</b>\n\n')

        if curier.order:
            text += '💭  <b>Ваш активный заказ</b>\n'
            order = await db.get_order(id=curier.order.id)
            user = await db.get_user(id=order.user_id)
            address = await db.get_user_address(id=order.address_id)
            text += (f'🌎  Адрес: {address.street} д. {address.house} под. {address.entrance} кв. {address.flat} '
                     f'эт. {address.floor}\n')
            text += f'👤  Имя получателя: {user.name if user.name else "Не указано"}\n'
            if address.comment:
                text += f'💭  Комментарий: {address.comment}\n'
            text += f'🕓  Установленное время: {order.time_to_delivery}\n\n'
        return await sender.sm(
            message_id=message_id,
            text=text,
            chat_id=message.chat.id,
            reply_markup=kb.worker_kb(curier=curier)
        )

@r.message(CommandStart())
async def start(message: Message, sender: Sender, kb: Keyboards, db: Database, state: FSMContext):
    await message.delete()
    await menu(message=message, sender=sender, kb=kb, db=db, state=state)

@r.callback_query(F.data == 'menu')
async def menu_callback(call: CallbackQuery, sender: Sender, kb: Keyboards, state: FSMContext, db: Database):
    await menu(message=call.message, sender=sender, kb=kb, db=db, state=state, message_id=call.message.message_id)

@r.message(FSM.set_curier_balance)
async def set_curier_balance(message: Message, sender: Sender, db: Database, kb: Keyboards, state: FSMContext):
    await message.delete()

    data = await state.get_data()

    try:
        balance = float(message.text)
    except ValueError:
        await state.set_state(FSM.set_curier_balance)
        return await sender.sm(
            text='⚠✏  Введите правильный баланс',
            chat_id=message.chat.id,
            reply_markup=kb.set_curier_balance_kb()
        )

    if balance <= 0:
        await state.set_state(FSM.set_curier_balance)
        return await sender.sm(
            text='⚠✏  Введите баланс больше нуля',
            chat_id=message.chat.id,
            reply_markup=kb.set_curier_balance_kb()
        )

    try:
        curier_id = int(data["curier_id"])
    except TypeError:
        await state.set_state(FSM.set_curier_balance)
        return await sender.sm(
            text=f'⚠  Неправильный аргумент curier_id в set_curier_balance: {data}',
            chat_id=message.chat.id,
            reply_markup=kb.set_curier_balance_kb()
        )
    except KeyError:
        await state.set_state(FSM.set_curier_balance)
        return await sender.sm(
            text=f'⚠  Неправильный аргумент curier_id в set_curier_balance: {data}',
            chat_id=message.chat.id,
            reply_markup=kb.set_curier_balance_kb()
        )

    try:
        message_id = int(data["message_id"])
    except TypeError:
        await state.set_state(FSM.set_curier_balance)
        return await sender.sm(
            text=f'⚠  Неправильный аргумент message_id в set_curier_balance: {data}',
            chat_id=message.chat.id,
            reply_markup=kb.set_curier_balance_kb()
        )
    except KeyError:
        await state.set_state(FSM.set_curier_balance)
        return await sender.sm(
            text=f'⚠  Неправильный аргумент message_id в set_curier_balance: {data}',
            chat_id=message.chat.id,
            reply_markup=kb.set_curier_balance_kb()
        )

    curier = await db.get_curier(id=curier_id)
    if curier is None:
        await state.set_state(FSM.set_curier_balance)
        return await sender.sm(
            text=f'⚠  Курьер {curier_id} не найден',
            chat_id=message.chat.id,
            reply_markup=kb.set_curier_balance_kb()
        )

    curier = await db.update_curier(balance=balance, id=curier_id)

    text = await get_curier_info(curier_id=curier.id, db=db)

    await sender.sm(
        message_id=message_id,
        text=f'✅  Баланс курьера {curier_id} обновлен\n\n{text}',
        chat_id=message.chat.id,
        reply_markup=kb.curier_kb(curier=curier)
    )

@r.message(FSM.set_order_time)
async def set_order_time(message: Message, sender: Sender, db: Database, kb: Keyboards, state: FSMContext):
    await message.delete()

    data = await state.get_data()

    try:
        order_id = int(data["order_id"])
    except TypeError:
        return await sender.sm(
            text=f'⚠  Неправильный аргумент order_id в set_order_time: {data}',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except KeyError:
        return await sender.sm(
            text=f'⚠  Неправильный аргумент order_id в set_order_time: {data}',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    try:
        from_ = data["from_"]
    except TypeError:
        return await sender.sm(
            text=f'⚠  Неправильный аргумент from_ в set_order_time: {data}',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    except KeyError:
        return await sender.sm(
            text=f'⚠  Неправильный аргумент from_ в set_order_time: {data}',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.get_order(id=order_id)
    if order is None:
        await sender.sm(
            text=f'⚠  Заказ {order_id} не найден',
            chat_id=message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    order = await db.update_order(id=order_id, time_to_delivery=message.text)
    await state.clear()
    await sender.sm(
        message_id=data["message_id"],
        text=f'✅  Время доставки обновлено\n\n{await get_order_info(db=db, order_id=order_id)}',
        chat_id=message.chat.id,
        reply_markup=kb.order_kb(order=order, from_=from_)
    )