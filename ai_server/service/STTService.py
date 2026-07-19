import sys
import os
import time 
import logging
import argparse
import json
from typing import Any, Dict
from dto.STTRequest import STTRequest
from dto.BaseModel import BaseModel
from faster_whisper import WhisperModel

from util.utils import Util
from util.LogUtil import LogUtil
from pathlib import Path
import logging
from logging.handlers import TimedRotatingFileHandler
# JOBS_DIR = Path.cwd() / "jobs"

 
#     job_id : 블라블라 
#     model large-v3, large, distil-large-v2, distil-large-v3, large-v3-turbo ,
#     lang "ko"
 

venv_dll_path = Path(__file__).resolve().parents[2] / ".venv" / "Scripts"
os.add_dll_directory(str(venv_dll_path))

LOG_FILE_PATH = Path.cwd() / "logs" / "stt_service.log"

stt_logger = logging.getLogger(__name__) # 모듈벌로 독립적인 로거 관리. 
stt_logger.setLevel(logging.INFO)

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
stt_logger.addHandler(console_handler)
stt_logger.addHandler(file_handler)


def format_elapsed_time(elapsed):
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    milliseconds = int((elapsed % 1) * 1000)

    return f"{minutes:02d}:{seconds:02d}:{milliseconds:03d}"

def seconds_to_srt_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = round((seconds % 1) * 1000)

    return (
        f"{hours:02d}:"
        f"{minutes:02d}:"
        f"{secs:02d},"
        f"{millis:03d}"
    )



async def handle_stt(request_body: Dict[str, Any]) -> Dict[str, Any]:
    # stt_logger = logging.getLogger("uvicorn.error")    
    JOBS_DIR = Path(__file__).resolve().parents[2] / "jobs"

    # Build STTRequest from incoming body (tolerant to key names)
    stt = STTRequest(
        job_id=request_body.get("job_id"),
        model=request_body.get("model"),
        language=request_body.get("language")
    )

    stt_logger.info(f"인자값 {stt.job_id} ai_model명 {stt.model} 언어 : {stt.language}")

    AUDIO_PATH = JOBS_DIR / stt.job_id / "audio.mp3"
    OUTPUT_SRT_PATH = JOBS_DIR / stt.job_id / "translation.srt"
 
    device_str = "cuda"
    compute_type= "int8"
    cpu_threads = int(4)
    num_workers = int(2)

    stt_logger.info(f"오디오 경로 : {AUDIO_PATH}")
    stt_logger.info(f"출력한 srt파일  : {OUTPUT_SRT_PATH}")

    ai_model = WhisperModel(
                        model_size_or_path=stt.model, 
                        device=device_str, 
                        compute_type=compute_type, 
                        cpu_threads=cpu_threads, 
                        num_workers=num_workers 
                     )
    segments, info = ai_model.transcribe(str(AUDIO_PATH.resolve()), language=stt.language)


    full_text = ""
    with open(OUTPUT_SRT_PATH, "w", encoding="utf-8") as f:
        for i, segment in enumerate(segments, start=1):
            f.write(f"{i}\n")
            f.write(f"{seconds_to_srt_time(segment.start)} --> {seconds_to_srt_time(segment.end)}\n")
            f.write(f"{segment.text.strip()}\n\n")
            full_text+=f"{segment.text.strip()}\n\n"
        end_time = time.perf_counter()

    base = BaseModel(code=0, message="stt request accepted")
    data = {
        "job_id": stt.job_id,
        
    }

    # "transcript": full_text

    

    

    return base.to_response(data)
