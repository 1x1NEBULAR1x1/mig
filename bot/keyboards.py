from typing import Sequence

from aiogram.utils.keyboard import InlineKeyboardBuilder, InlineKeyboardButton, InlineKeyboardMarkup
from enum import Enum

from database.schema import Order, OrderStatus, Curier, City


def btn(t: str, cd: str) -> InlineKeyboardButton:
    return InlineKeyboardButton(text=t, callback_data=cd)

class Keyboards:

    class Sorting(Enum):
        """'newest' or 'oldest'"""
        newest = 'newest'
        oldest = 'oldest'

    @staticmethod
    def register_kb() -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='✏  Да', cd='register_start'))
        return kb.as_markup()

    @staticmethod
    def back(to: str) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='⬅️  Назад', cd=to))
        return kb.as_markup()

    @staticmethod
    def register_cities_kb(cities: Sequence[City]) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        for city in cities:
            kb.row(btn(t=city.name, cd=f'register_city_{city.id}'))
        kb.row(btn(t='⬅️  Назад', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def register_name_kb(name: str) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        if len(name) > 0:
            kb.row(btn(t=f'{name}', cd=f'register_name_{name}'))
        kb.row(btn(t='⬅️  Назад', cd=f'register_start'))
        return kb.as_markup()

    @staticmethod
    def send_request_kb(data: dict) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='✅  Отправить', cd=f'send_request_{data["city_id"]}_{data["name"]}_{data["phone"]}'))
        kb.row(btn(t='⬅️  Назад', cd=f'register_name_{data["name"]}'))
        return kb.as_markup()

    @staticmethod
    def request_action_kb(request_id: int) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='✅  Принять', cd=f'request_accept_{request_id}'))
        kb.row(btn(t='❌  Отклонить', cd=f'request_decline_{request_id}'))
        return kb.as_markup()

    @staticmethod
    def worker_kb(curier: Curier) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()

        if curier.order is None:
            if not curier.is_available:
                kb.row(btn(t='⚡  Начать смену', cd=f'worker_edit_is-available_True'))
            else:
                kb.row(btn(t='💤  Завершить смену', cd=f'worker_edit_is-available_False'))
        else:
            kb.row(btn(t='👁‍🗨  Детали заказа', cd=f'worker_order'))

        return kb.as_markup()



    @staticmethod
    def main_kb() -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='👁‍🗨  Активные заказы', cd='orders_cities_active'))
        kb.row(btn(t='🧾  История заказов', cd='orders_cities_history'))
        kb.row(btn(t='💭  Отчёты', cd='reports_menu'))
        kb.row(btn(t='📬  Курьеры', cd='curiers_cities_0'))
        return kb.as_markup()

    @staticmethod
    def orders_cities_kb(cities: Sequence[City], from_: str) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        for city in cities:
            kb.row(btn(t=city.name, cd=f'orders_city_{city.id}_{from_}'))
        kb.row(btn(t='⬅️  Назад', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def back_to_order_kb(order_id: int, from_: str) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='⬅️  Назад', cd=f'order_{order_id}_{from_}'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def active_orders_kb(
        city_id: int,
        orders: list,
        page: int = 0,
        limit: int = 30,
        sorting: Sorting = 'newest',
    ) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        if sorting == Keyboards.Sorting.newest:
            kb.row(btn(t='📅🔽  Дате', cd=f'active_orders_{city_id}_oldest_{page}'))
            kb.row(btn(t='📅🔼  Дата', cd=f'active_orders_{city_id}_newest_{page}'))
        for order in orders:
            kb.row(btn(t=f'Заказ №{order.id} ({order.status.name})', cd=f'order_{order.id}_active'))
        if page > 0 and len(orders) == limit:
            kb.row(btn(t='⬅️', cd=f'active_orders_{city_id}_{sorting}_{page-1}'),
                   btn(t='➡️', cd=f'active_orders_{city_id}_{sorting}_{page+1}'))
        elif page > 0:
            kb.row(btn(t='⬅️', cd=f'active_orders_{city_id}_{sorting}_{page-1}'))
        if len(orders) == limit:
            kb.row(btn(t='➡️', cd=f'active_orders_{city_id}_{sorting}_{page+1}'))
        kb.row(btn(t='🔚  Назад', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def orders_history_kb(
        city_id: int,
        orders: list,
        page: int = 0,
        limit: int = 30,
        sorting: Sorting = 'newest'
    ) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        if sorting == Keyboards.Sorting.newest:
            kb.row(btn(t='📅🔽  Дате', cd=f'orders_history_{city_id}_oldest_{page}'))
            kb.row(btn(t='📅🔼  Дата', cd=f'orders_history_{city_id}_newest_{page}'))
        for order in orders:
            kb.row(btn(t=f'Заказ №{order.id}', cd=f'order_{order.id}_history'))
        if page > 0 and len(orders) == limit:
            kb.row(btn(t='⬅️', cd=f'orders_history_{city_id}_{sorting}_{page-1}'),
                   btn(t='➡️', cd=f'orders_history_{city_id}_{sorting}_{page+1}'))
        elif page > 0:
            kb.row(btn(t='⬅️', cd=f'orders_history_{city_id}_{sorting}_{page-1}'))
        if len(orders) == limit:
            kb.row(btn(t='➡️', cd=f'orders_history_{city_id}_{sorting}_{page+1}'))
        kb.row(btn(t='🔚  Назад', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def order_kb(order: Order, from_: str = 'active') -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t=f"👁‍🗨  Список продуктов", cd=f"order_products_{order.id}_{from_}"))
        if not order.is_payment_accepted:
            kb.row(btn(t="✅  Подтвердить оплату", cd=f"order_accept_payment_{order.id}_{from_}"))
        if from_ == 'history':
            kb.row(btn(t='↩  Назад', cd=f'orders_history_{order.address.city_id}_newest_0'))
        elif from_ == 'active':
            kb.row(btn(t="🕓  Установить время доставки", cd=f"order_time_{order.id}_{from_}"))
            kb.row(btn(t="✏  Изменить статус", cd=f"order_change_status_{order.id}_{from_}"))
            if order.curier_id is None:
                kb.row(btn(t="🚚  Назначить курьера", cd=f"order_change_curier_{order.id}_{from_}"))
            else:
                kb.row(btn(t="❌  Снять курьера", cd=f"order_delete_curier_{order.id}_{from_}"))
            kb.row(btn(t='↩  Назад', cd=f'active_orders_{order.address.city_id}_newest_0'))
        elif from_ == 'curier':
            if order.curier_id is None:
                kb.row(btn(t="🚚  Назначить курьера", cd=f"order_change_curier_{order.id}_{from_}"))
            else:
                kb.row(btn(t="❌  Снять курьера", cd=f"order_delete_curier_{order.id}_{from_}"))
                kb.row(btn(t='↩  Назад', cd=f'curier_data_{order.curier_id}'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def order_time_kb(order_id: int, from_: str) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        if from_ == 'history':
            kb.row(btn(t='↩  Назад', cd=f'order_{order_id}_history'))
        elif from_ == 'active':
            kb.row(btn(t='↩  Назад', cd=f'order_{order_id}_active'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def order_products_kb(order_id: int, from_: str) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        if from_ == 'history':
            kb.row(btn(t='↩  Назад', cd=f'order_{order_id}_history'))
        elif from_ == 'active':
            kb.row(btn(t='↩  Назад', cd=f'order_{order_id}_active'))
        elif from_ == 'curier':
            kb.row(btn(t='↩  Назад', cd=f'curier_data_{order_id}'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def order_change_status_kb(order_id: int, from_: str, statuses: OrderStatus) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        for status in statuses:
            kb.row(btn(t=status.name, cd=f"order_set_status_{order_id}_{status.id}_{from_}"))
        if from_ == 'history':
            kb.row(btn(t='↩  Назад', cd=f'order_{order_id}_history'))
        elif from_ == 'active_orders':
            kb.row(btn(t='↩  Назад', cd=f'order_{order_id}_active'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def order_change_curier_kb(order_id: int, from_: str, curiers: Sequence[Curier]) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        for curier in curiers:
            kb.row(btn(t=f"✅ {curier.full_name} (тел. {curier.phone_number})",
                       cd=f"order_set_curier_{order_id}_{curier.id}_{from_}"))
        if from_ == 'history':
            kb.row(btn(t='↩  Назад', cd=f'order_{order_id}_history'))
        elif from_ == 'active':
            kb.row(btn(t='↩  Назад', cd=f'order_{order_id}_active'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()


    @staticmethod
    def curiers_cities_kb(cities: Sequence[City]) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        cities = cities[:45]
        for city in cities:
            kb.row(btn(t=f"{city.name}", cd=f"curiers_list_{city.id}"))
        kb.row(btn(t='🔚  Назад', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def curier_city_kb(cities: Sequence[City], curier_id: int) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        for city in cities:
            kb.row(btn(t=f"{city.name}", cd=f"curier_edit_{curier_id}_city-id_{city.id}"))
        kb.row(btn(t='🔚  Назад', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def curiers_list_kb(
        city_id: int,
        curiers: list,
        limit: int = 30,
        page: int = 0
    ) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        for curier in curiers:
            kb.row(btn(t=f'{"✅" if curier.is_available else "❌"} #{curier.id} {curier.full_name} '
                         f'(тел. {curier.phone_number})', cd=f'curier_data_{curier.id}'))
        if page > 0 and len(curiers) == limit:
            kb.row(btn(t='⬅️', cd=f'curiers_list_{city_id}_{page-1}'),
                   btn(t='➡️', cd=f'curiers_list_{city_id}_{page+1}'))
        elif page > 0:
            kb.row(btn(t='⬅️', cd=f'curiers_list_{city_id}_{page-1}'))
        if len(curiers) == limit:
            kb.row(btn(t='➡️', cd=f'curiers_list_{city_id}_{page+1}'))
        kb.row(btn(t='↩  Назад', cd='curiers_cities_0'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def curier_kb(curier: Curier) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        if curier.order is not None:
            kb.row(btn(t='🔎📌  Данные заказа', cd=f'order_{curier.order.id}_curier'))
        kb.row(btn(t='✏💰  Редактировать баланс', cd=f'curier_balance_{curier.id}'))
        if not curier.is_banned:
            kb.row(btn(t='❌  Забанить', cd=f'curier_edit_{curier.id}_is-banned_True'))
        else:
            kb.row(btn(t='✅  Разбанить', cd=f'curier_edit_{curier.id}_is-banned_False'))
        kb.row(btn(t='🌎✏  Изменить город', cd=f'curier_city_{curier.id}'))
        kb.row(btn(t='⬅️  Назад', cd=f'curiers_list_{curier.city_id}_0'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def curier_balance_kb(curier_id: int) -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='⬅️  Назад', cd=f'curier_data_{curier_id}'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def reports_kb() -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='☀  Ежедневный отчёт', cd='report_day'))
        kb.row(btn(t='📊  Еженедельный отчёт', cd='report_week'))
        kb.row(btn(t='📅  Ежемесячный отчёт', cd='report_month'))
        kb.row(btn(t='🔚  Назад', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def report_kb() -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='↩  Назад', cd='reports_menu'))
        kb.row(btn(t='🔚  Главное меню', cd='menu'))
        return kb.as_markup()

    @staticmethod
    def back_to_main_kb() -> InlineKeyboardMarkup:
        kb = InlineKeyboardBuilder()
        kb.row(btn(t='⬅️  Назад', cd='menu'))
        return kb.as_markup()