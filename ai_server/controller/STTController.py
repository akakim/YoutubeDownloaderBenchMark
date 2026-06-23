import time 

from typing import Any, Dict
from dto.STTRequest import STTRequest
from dto.BaseModel import BaseModel

from utils import Util

async def handle_stt(request_body: Dict[str, Any]) -> Dict[str, Any]:
    """Handle incoming STT request payload and return standardized response."""

    start_time = time.time()


    # delegate to controller


    elapsed = time.time() - start_time
    elapsed_text = Util.format_elapsed_time(elapsed)

    # Build STTRequest from incoming body (tolerant to key names)
    stt = STTRequest(
        job_id=request_body.get("jobId"),

    )

    # TODO: add real STT processing here (enqueue job, call worker, etc.)
    # For now, return a simple acknowledgement including parsed fields.
    base = BaseModel(code=0, message="stt request accepted")
    data = {
        "job_id": stt.job_id,
    }
    return base.to_response(data)
