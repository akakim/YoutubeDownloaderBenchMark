import sys
import time
import logging
import traceback


from enum import Enum
from fastapi import FastAPI, Request, HTTPException
from util.LogUtil import LogUtil
from service.STTService import STTService
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

class ModelName(str,Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"
    

# class Job(str,str):

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite 기본 포트
    "http://127.0.0.1:5173",
]




LOG_FILE_PATH = Path.cwd() / "logs" / "application.log"
# 로거 생성 및 로깅 레벨 설정
logger = logging.getLogger(__name__) # 모듈벌로 독립적인 로거 관리. 
logger.setLevel(logging.INFO)

formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# 콘솔 출력 핸들러
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)

# 날짜별 로테이션 파일 핸들러
file_handler = TimedRotatingFileHandler(
    filename=LOG_FILE_PATH,
    when='midnight',  # 자정마다 로테이션
    interval=1,       # 1일 간격
    backupCount=30,   # 30일치 보관
    encoding='utf-8'
)
file_handler.setFormatter(formatter)

# 로테이션된 파일명 포맷 설정
file_handler.suffix = "%Y%m%d"

# 핸들러 추가
logger.addHandler(console_handler)
logger.addHandler(file_handler)

@app.get("/")
def root():
    logger.info("루트 엔드포인트가 호출되었습니다.")
    logger.error("에러 테스트 로그입니다.")
    print("PRINT LOG TEST")
    print('hello fastAPI')
    # logger.info("test %s", "notable problem")
    # test = "tttt "

    return {
                "message":"hello Fast API ",
                "is_debug": LogUtil.IS_DEBUG
            }


@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {"model_name" : model_name,"message": "DeepLearning FTW"}
    if model_name.value == "lenet":
        return {"model_name" : model_name,"message": "LeCNN all the images"}
    
@app.post("/stt")
async def stt(request: Request):
 
    body = await get_json_body(request)
  
    response = await STTService.handleSTT(body)

    return response    

@app.post("/downloadTester")
async def downloadTester(request: Request):

    body = await get_json_body(request)

    # delegate to controller
    response = await STTService.handleDownload(body)

    return response 


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logger.exception(
        "Unhandled exception: %s %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "exception_type": type(exc).__name__,
            "path": str(request.url),
        },
    )

async def get_json_body(request: Request) -> dict[str, any]:
    try:
        body = await request.json()
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid JSON payload",
        ) from exc

    if not isinstance(body, dict):
        raise HTTPException(
            status_code=400,
            detail="JSON body must be an object",
        )

    return body



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # 허용할 프론트엔드 주소
    allow_credentials=True,      # 쿠키·인증 정보 허용
    allow_methods=[
        "GET",
        "POST",
    ],         # GET, POST, PUT, DELETE 등
    allow_headers=[
        "Authorization",
        "Content-Type",
    ],
    expose_headers=[
        "Content-Disposition",
    ]
)
