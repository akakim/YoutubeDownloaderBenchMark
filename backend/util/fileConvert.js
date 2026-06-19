import { spawn } from 'child_process';

const extractMp3FromMp4 = async (inputMp4Path, outputMp3Path) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-i', inputMp4Path,
      '-vn',
      '-ac', '1',
      '-ar', '16000',
      '-b:a', '64k',
      outputMp3Path,
    ]);

    let stderr = '';

    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('error', (error) => {
      reject(error);
    });

    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg failed with code ${code}: ${stderr}`));
      }

      resolve(outputMp3Path);
    });
  });
};