from api.main import main as api_main
from bot.main import main as bot_main
from asyncio import new_event_loop, set_event_loop_policy, WindowsSelectorEventLoopPolicy
from sys import platform
if platform == "win32":
    set_event_loop_policy(WindowsSelectorEventLoopPolicy())

def main():
    loop = new_event_loop()
    loop.create_task(api_main())
    loop.create_task(bot_main())
    loop.run_forever()

if __name__ == '__main__':
    main()