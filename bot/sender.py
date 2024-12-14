from aiogram import Bot
from aiogram.types import (Message, InputMediaPhoto, InputMediaVideo, InputMediaDocument, InputMediaAudio,
                           InlineKeyboardMarkup, ReplyKeyboardMarkup, Animation)
from lazy_object_proxy.utils import await_

from database.engine import Database
from enum import Enum
from aiogram.exceptions import TelegramRetryAfter, TelegramBadRequest
from typing import Sequence


class Sender:

    def __init__(self, bot: Bot):
        self.bot: Bot = bot

    async def send(
        self,
        chat_id: int,
        text: str | None = None,
        reply_markup: InlineKeyboardMarkup | ReplyKeyboardMarkup | None = None,
        parse_mode: str = 'HTML'
    ):
        return await self.sm(chat_id=chat_id, text=text, reply_markup=reply_markup, parse_mode=parse_mode)

    async def bot_edit_send_message(
        self,
        chat_id: int,
        message_id: int,
        text: str | None = None,
        reply_markup: InlineKeyboardMarkup | ReplyKeyboardMarkup | None = None,
        parse_mode: str = 'HTML'
    ):
        if message_id:
            return await self.bot.edit_message_text(
                chat_id=chat_id,
                text=text,
                message_id=message_id,
                reply_markup=reply_markup,
                parse_mode=parse_mode
            )
        return await self.bot.send_message(
            chat_id=chat_id,
            text=text,
            reply_markup=reply_markup,
            parse_mode=parse_mode
        )


    async def sm(
        self,
        chat_id: int,
        text: str | None = None,
        reply_markup: InlineKeyboardMarkup | ReplyKeyboardMarkup | None = None,
        message_id: int = None,
        parse_mode: str = 'HTML'
    ) -> Message | None:
        try:

            return await self.bot_edit_send_message(
                chat_id=chat_id,
                message_id=message_id,
                text=text,
                reply_markup=reply_markup,
                parse_mode=parse_mode
            )

        except TelegramRetryAfter as e:

            await sleep(e.retry_after + 0.1)
            print(f'*Notice*   Telegram Retry After Exception: {e.retry_after} seconds\n'
                  f'{e.message}\n{e.method}\n{e.args}')

            return await self.bot_edit_send_message(
                chat_id=chat_id,
                text=text,
                reply_markup=reply_markup,
                message_id=message_id,
                parse_mode=parse_mode
            )

        except TelegramBadRequest as e:

            print(f'*ERROR*   Telegram Bad Request Exception: {e.message}\n{e.method}\n{e.args}')

            match e.message:
                case 'Bad Request: chat not found':
                    return

                case 'Bad Request: message is not modified':
                    return

                case "Bad Request: Message can't be edited":

                    return await self.sm(
                        chat_id=chat_id,
                        text=text,
                        reply_markup=reply_markup
                    )


                case "Bad Request: can't parse entities in message text":

                    return await self.sm(
                        chat_id=chat_id,
                        text=text,
                        reply_markup=reply_markup,
                        parse_mode='Markdown'
                    )


        except Exception as e:

            print(e)