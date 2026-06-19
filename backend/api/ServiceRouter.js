import express, { response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import spawn from 'cross-spawn';
import v_logging from '../util/logUtil.js';

import { updateMetadataStatus } from '../util/CommonUtil.js'; 
import { getFfmpegPath } from '../util/CommonUtil.js';

const router = express.Router();
const JOBS_DIR = path.join(process.cwd(), 'backend', 'uploads', 'jobs');


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load API key from openai.json
const openaiConfigPath = path.join(__dirname, '..', 'openai.json');
const openaiConfig = JSON.parse(fs.readFileSync(openaiConfigPath, 'utf8'));


const openai_client = new OpenAI({
  apiKey: openaiConfig.apiKey,
});

const transcriptStore = new Map();



const runFfmpeg = (sourceMp4Path, audioMp3Path) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(getFfmpegPath(), [
      '-y',
      '-i', sourceMp4Path,
      '-vn',
      '-acodec', 'libmp3lame',
      '-ar', '44100',
      '-ac', '2',
      '-b:a', '192k',
      audioMp3Path,
    ]);

    let stderr = '';

    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('error', (error) => {
      reject(error);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true });
        return;
      }

      reject(new Error(`ffmpeg failed with code ${code}: ${stderr}`));
    });
  });
};



const convertMp4ToMp3 = async (jobId) => {
  const jobDir = path.join(JOBS_DIR, jobId);
  const metadataPath = path.join(jobDir, 'metadata.json');
  const sourceMp4Path = path.join(jobDir, 'source.mp4');
  const audioMp3Path = path.join(jobDir, 'audio.mp3');

    let caughtError = null;

    fs.promises.access(sourceMp4Path)
      .then(() => { 
        runFfmpeg(sourceMp4Path, audioMp3Path)

        return "sourceMp4Path exists, ffmpeg conversion attempted";
      })
      .then((ffmpegResult) => {
          console.log('callback status:', ffmpegResult);
      })
      .catch((error) => {
        caughtError = error;
      }).finally(() => {
        console.log('ffmpeg 변환 시도 완료');
        if (caughtError) {
          return {
            success: false,
            error: `${caughtError}`,
            sourceMp4Path
          };
        }
        // 여기부터 ffmpeg 실행
      return {
        success: true,
        jobId,
        jobDir,
        sourceMp4Path,
        audioMp3Path,
        metadataPath
      };
    }); 
  

};
 


function runFasterWhisper(inputAudioPath, outputSrtPath,model,language) {
  return new Promise((resolve, reject) => {
      // const scriptPath = path.resolve("./local_ai/faster_whisper.py");
      const scriptPath = path.resolve(
            process.cwd(),
            "local_ai",
            "run_faster_whisper.py"
          );
      /**
       * python .\faster_whisper_test.py --inputAudioPath ../backend/uploads/jobs/0610005125_023da53a/audio.mp3 --model large-v3-turbo --cpu_threads 4 --num_workers 2
       */
      const pythonPath = "D:\\LLM\\YoutubeDownloaderBenchMark\\.venv\\Scripts\\python.exe";
      const proc = spawn("python", [
        scriptPath,
        "--inputAudioPath", inputAudioPath,
        "--outputSrtPath", outputSrtPath,
        "--model", model ,
        "--cpu_threads", "4",
        "--num_workers", "2",
        "--language", language
      ], {
        shell: false,
        stdio: ["ignore", "pipe", "pipe"]
      });
  
      let stdout = "";
      let stderr = "";
  
      console.log( proc.spawnargs );
      proc.stdout.on("data", data => {
        stdout += data.toString("utf8");
      });

      proc.stderr.on("data", data => {
        stderr += data.toString();
      });
      
      proc.on("spawn", () => {
        console.log("[spawned] Python process started");
        console.log("[pid]", proc.pid);
        
      });
      
      proc.on("error", err => {
        console.error("[spawn error]", err);
        reject(err);
      });

      proc.on("exit", (code, signal) => {
        console.log("[exit]", { code, signal });
      });

      proc.on("close", code => {
      if (code === 0) {
       const result = JSON.parse(stdout);
       resolve(result);
      } else {
        reject(new Error(`faster-whisper failed: ${stderr}`));
      }
      });

    })
  }
    
    
    // .then((sttResult) =>{
    //    console.log(sttResult); // Python의 print 결과
    //    updateMetadataStatus(jobId,STATUS);
    //    return res.json({
    //     success: true,
    //     jobId,
    //     status: STATUS,
    //   });
    // }).catch((error)=>{
        
    //   return res.json({
    //     success: false,
    //     jobId: jobId,
    //     error: error
    //   });

    // })
    

export async function rewriteToCuriousStyle(rawScript) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: rawScript,
  });

  return response.output_text;
}




router.post('/convertMp4ToMp3', async (req, res) => {

  const { jobId } = req.body;

  const jobDir = path.join(JOBS_DIR, jobId);
  const sourceMp4Path = path.join(jobDir, 'source.mp4');
  const audioMp3Path = path.join(jobDir, 'audio.mp3');

  const convertResult = await convertMp4ToMp3(jobId);
  

  const updateResult = await updateMetadataStatus(jobId, 'mp3_converted');

  v_logging({
    step: 'convert_mp4_to_mp3',
    requestId: req.requestId,
    jobId,
    jobDir,
    sourceMp4Path,
    audioMp3Path,
    metadataStatus:{
      updateResult
    }
  }, false);

  if (!updateResult.success) {
    return res.status(500).json({
      success: false,
      error: updateResult.error
    });
  }

  return res.json({
    success: true,
    jobId,
    status: 'mp3_converted',
  });
});

router.post('/convertMp4ToMp3', async (req, res) => {

  const { jobId } = req.body;

  const jobDir = path.join(JOBS_DIR, jobId);
  const sourceMp4Path = path.join(jobDir, 'source.mp4');
  const audioMp3Path = path.join(jobDir, 'audio.mp3');

  const convertResult = await convertMp4ToMp3(jobId);
  

  const updateResult = await updateMetadataStatus(jobId, 'mp3_converted');

  v_logging({
    step: 'convert_mp4_to_mp3',
    requestId: req.requestId,
    jobId,
    jobDir,
    sourceMp4Path,
    audioMp3Path,
    metadataStatus:{
      updateResult
    }
  }, false);

  if (!updateResult.success) {
    return res.status(500).json({
      success: false,
      error: updateResult.error
    });
  }

  return res.json({
    success: true,
    jobId,
    status: 'mp3_converted',
  });
});

/** language: en => ko로 체크하기  */
router.post('/convertMp3ToSTT', async (req, res) => {


  const { jobId, model, language } = req.body;

  const jobDir = path.join(JOBS_DIR, jobId);
  const sourceMp4Path = path.join(jobDir, 'source.mp4');
  const audioMp3Path = path.join(jobDir, 'audio.mp3');
  const srtFileName = 'transcription.srt'
  const srtPath = path.join(jobDir,srtFileName)

  const STATUS = 'transcription_success';
  let srtSource = null;
  let errorMessage = null;
  let stdout = "";
  let stderr = "";
  
  console.log( req.body );
  await runFasterWhisper(audioMp3Path,srtPath,model,language)
   .then((sttResult) =>{
       console.log(sttResult); // Python의 print 결과
       updateMetadataStatus(jobId,STATUS);
       return res.json({
        success: true,
        jobId,
        status: STATUS,
        transcript: sttResult
      });
    }).catch((error)=>{
        console.log("error : ",error); 
      return res.json({
        success: false,
        jobId: jobId,
        error: error
      });
    });

});

router.post('/download-srt/:jobId',(req,res)=>{
  const { jobId } = req.params;

  const srtPath = path.join(
    process.cwd(),
    "backend",
    "uploads",
    "jobs",
    jobId,
    'transcription.srt'
  );

  res.download(srtPath, `${jobId}.srt`);

});

router.post('/rewriteScript ', async (req, res) => {

  const { rawScript } = req.body;

  const prompt = `너는 쇼츠 대본 편집자다.
                    아래 원본 정보 대본을
                    내 스타일로 바꿔라.

                    스타일 규칙:
                    - 직접 설명보다 궁금하게 만든다
                    - Hook → 전개 → 반전/강조 → CTA 구조
                    - 첫 문장은 클릭을 유도한다
                    - 문장은 짧게
                    - 자막은 1줄 8~14자 정도
                    - 말하지 않아도 되는 부분은 침묵으로 처리
                    - 영상 행동 지시를 괄호로 넣는다
                    - 정보는 과장하지 않는다

                    원본 대본:
                    ${rawScript}

                    출력 형식:
                    [HOOK]
                    [전개]
                    [반전/강조]
                    [CTA]
                    `;
                    await rewriteToCuriousStyle( rawScript )
                    .then( response =>{

                      return res.json({
                        success: true,
                        jobId,
                        status: 'rewrite_curious_style'
                      });
                    })
                    return res.status(500).json({
                      success: false,
                      jobId,
                      status: 'stt_failed',
                      error: error.message
                    });

});


function saveTranscript(jobId, transcript) {
  transcriptStore.set(jobId, {
    transcript,
    createdAt: Date.now()
  });
}

function clearTranscriptStore() {
  transcriptStore.clear();
}


export default router;
