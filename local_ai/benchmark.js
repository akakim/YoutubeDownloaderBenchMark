import path from "path";
import { spawn } from "child_process";
import { performance } from "perf_hooks";

const TEST_AUDIO = "../backend/uploads/jobs/0610005125_023da53a/audio.mp3";  // 테스트할 오디오 파일 경로
const OUT_PUT_PATH= "./results";
/* 개선한 코드  */
function runFasterWhisper(inputAudioPath, outputSrtPath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve("faster_whisper_test.py");

    /**
     * python .\faster_whisper_test.py --inputAudioPath ../backend/uploads/jobs/0610005125_023da53a/audio.mp3 --model large-v3-turbo --cpu_threads 4 --num_workers 2
     */
    const proc = spawn("python", [
      scriptPath,
      "--inputAudioPath", inputAudioPath,
      "--outputSrtPath", outputSrtPath,
      "--model", "large-v3-turbo",
      "--cpu_threads", "4",
      "--num_workers", "2",
      "--language","ko"
    ], {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stderr = "";

    proc.stderr.on("data", data => {
      stderr += data.toString();
    });

    proc.on("close", code => {
      if (code === 0) {
        resolve(outputSrtPath);
      } else {
        reject(new Error(`faster-whisper failed: ${stderr}`));
      }
    });
  });
}

/* 인자 전달의 취약점과 관련있음. 
function runCommand(name, command, args) {
  return new Promise((resolve, reject) => {
    const start = performance.now();

    const proc = spawn(command, args, {
      shell: true,
      stdio: "inherit"
    });

    proc.on("close", code => {
      const end = performance.now();
      const seconds = ((end - start) / 1000).toFixed(2);

      if (code === 0) {
        resolve({ name, seconds });
      } else {
        reject(new Error(`${name} failed with code ${code}`));
      }
    });
  });
}
*/

await runFasterWhisper( TEST_AUDIO, OUT_PUT_PATH );

// await runCommand("openai-whisper", "whisper", [
//    TEST_AUDIO,
//   "--model", "large-v3",
//   "--language", "en",
//   "--output_format", "srt",
//   "--output_dir", "results/openai"
// ]);



// await runCommand("whisper.cpp", "main", [
//   "-m", "models/ggml-large-v3.bin",
//   "-f", TEST_AUDIO,
//   "-osrt",
//   "-of", "results/whisper_cpp"
// ]);
