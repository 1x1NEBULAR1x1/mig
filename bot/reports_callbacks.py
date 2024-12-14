from aiogram import Router, F
from aiogram.types import CallbackQuery
from bot.sender import Sender
from bot.keyboards import Keyboards
from database.engine import Database
from datetime import timedelta

r = Router()

async def get_report(type_: str, db: Database) -> str:
    if type_ == 'day':
        time = timedelta(days=1)
    elif type_ == 'week':
        time = timedelta(days=7)
    elif type_ == 'month':
        time = timedelta(days=30)
    else:
        return '⚠  Неправильный аргумент type_ в get_report'

    orders = await db.get_orders(timedelta=time)

    final_amount = 0.0
    estimated_amount = 0.0
    count_of_finished = 0
    count_of_canceled = 0
    count_in_process = 0

    order_statuses = await db.get_order_statuses()
    sorted_statuses = []

    for status in order_statuses:
        sorted_statuses.append({'id': status.id, 'name': status.name, 'count': 0})

    for order in orders:
        if order.finished:
            count_of_finished += 1
            final_amount += float(order.total_price)

        if order.status_id not in [0, 5]:
            count_in_process += 1
            estimated_amount += float(order.total_price)

            for status in sorted_statuses:
                if status['id'] == order.status_id:
                    status['count'] += 1

        if order.status_id == 5:
            count_of_canceled += 1


    text = (
        f'📈<b>  Статистика за {"день" if type_ == "day" else "неделю" if type_ == "week" else "месяц"}\n\n'
        f'📦  Количество оформленных заказов: {len(orders)}\n'
        f'✅  Количество завершенных заказов: {count_of_finished}\n'
        f'❌  Количество отмененных заказов: {count_of_canceled}\n'
        f'⏳  Количество в процессе: {count_in_process}\n'
        f'💰  Текущая прибыль: {final_amount} ₽\n'
        f'💸  Предполагаемая прибыль: {estimated_amount} ₽\n\n'
        f'📊  Статистика по статусам:\n\n'
    )

    for status in sorted_statuses:
        text += f' - {status["name"]}: {status["count"]} заказов\n'

    text += f'</b>'

    return text





@r.callback_query(F.data == 'reports_menu')
async def reports_menu(call: CallbackQuery, sender: Sender, kb: Keyboards):
    await sender.sm(
        message_id=call.message.message_id,
        text='📊  Выберите действие',
        chat_id=call.message.chat.id,
        reply_markup=kb.reports_kb()
    )

@r.callback_query(F.data.startswith('report_'))
async def reports(call: CallbackQuery, sender: Sender, db: Database, kb: Keyboards):
    try:
        type_ = call.data.split('_')[1]
    except IndexError:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Неправильный аргумент sorting в reports: {call.data}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )
    try:
        data = await get_report(type_=type_, db=db)
    except Exception as e:
        return await sender.sm(
            message_id=call.message.message_id,
            text=f'⚠  Ошибка при составлении отчёта: {e}',
            chat_id=call.message.chat.id,
            reply_markup=kb.back_to_main_kb()
        )

    await sender.sm(
        message_id=call.message.message_id,
        text=data,
        chat_id=call.message.chat.id,
        reply_markup=kb.report_kb()
    )