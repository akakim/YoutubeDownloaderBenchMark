import os
import time
import argparse
import json
from faster_whisper import WhisperModel
from pathlib import Path

venv_dll_path = Path(__file__).resolve().parents[1] / ".venv" / "Scripts"
os.add_dll_directory(str(venv_dll_path))

# large-v1,large-v2, large-v3, large, distil-large-v2, distil-large-v3, large-v3-turbo
# model = WhisperModel(args.model, device=args.device, compute_type=args.compute_type)
# 1번 
# device="cuda"
# cpu_threads=8
# num_workers=1
# 2번
# device="cuda"
# cpu_threads=12
# num_workers=1
# 3번
# device="cuda"
# cpu_threads=4
# num_workers=2

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

start_time = time.perf_counter()
# large-v3, large, distil-large-v2, distil-large-v3, large-v3-turbo
parser = argparse.ArgumentParser()
parser.add_argument("--model", default="large-v3")
parser.add_argument("--device", default="cuda")
parser.add_argument("--compute_type", default="int8")
parser.add_argument("--cpu_threads", default="8")
parser.add_argument("--num_workers", default="1")
parser.add_argument("--language", default="ko")
parser.add_argument("--inputAudioPath", default="")
parser.add_argument("--outputSrtPath", default="./results")

args = parser.parse_args()



if not args.inputAudioPath:
    result = {
        "success": True,
        "result": "inputAudioPath is required."
    }   
    raise SystemExit(1)

start_time = time.perf_counter()
# model_size_or_path: str,
# device: str = "auto",
# device_index: Union[int, List[int]] = 0,
# compute_type: str = "default",
# cpu_threads: int = 0,
# num_workers: int = 1,

cpu_threads = int(args.cpu_threads)
num_workers = int(args.num_workers)

model = WhisperModel(
                        args.model, 
                        device=args.device, 
                        compute_type=args.compute_type, 
                        cpu_threads=cpu_threads, 
                        num_workers=num_workers 
                     )

# inputAudioPath,
# outputSrtPath

segments, info = model.transcribe(args.inputAudioPath, language=args.language)

file_name = f"{args.outputSrtPath}"

full_text = ""
with open(file_name, "w", encoding="utf-8") as f:
    for i, segment in enumerate(segments, start=1):
        f.write(f"{i}\n")
        f.write(f"{seconds_to_srt_time(segment.start)} --> {seconds_to_srt_time(segment.end)}\n")
        f.write(f"{segment.text.strip()}\n\n")
        full_text+=f"{segment.text.strip()}\n\n"
    end_time = time.perf_counter()


result = {
    "success": True,
    "transcript": full_text
}

print(json.dumps(result, ensure_ascii=False),flush=True)