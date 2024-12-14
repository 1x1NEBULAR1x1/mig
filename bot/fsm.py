from aiogram.fsm.state import State, StatesGroup


class FSM(StatesGroup):
    set_curier_balance = State()
    set_order_time = State()

    set_register_name = State()
    set_register_phone = State()