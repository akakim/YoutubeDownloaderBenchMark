import os
from pathlib import Path
from dotenv import load_dotenv


# root / ai_server / utils / LogUtil.py 기준
# FastAPI의 Logger만이 출력됨. 필요없지만 기록용으로만 남겨둠. 
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")


class LogUtil:
    IS_DEBUG = os.getenv("IS_DEBUG", "false").lower() == "true"

    @staticmethod
    def debug(*args, **kwargs):
        if LogUtil.IS_DEBUG:
            print(*args, **kwargs)

    @staticmethod
    def info(*args, **kwargs):
        print(*args, **kwargs)