import time 
import logging
from typing import Any, Dict
from dto.STTRequest import STTRequest
from dto.BaseModel import BaseModel

from util.utils import Util
from util.LogUtil import LogUtil
from pathlib import Path

# JOBS_DIR = Path.cwd() / "jobs"

#      const proc = spawn("python", [
#     scriptPath,
#     "--inputAudioPath", inputAudioPath,
#     "--outputSrtPath", outputSrtPath,
#     "--model", model ,
#     "--cpu_threads", "4",
#     "--num_workers", "2",
#     "--language", language
#   ], {
#     shell: false,
#     stdio: ["ignore", "pipe", "pipe"]
#   });
# const audioMp3Path = path.join(jobDir, 'audio.mp3'); 