
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const JOBS_DIR = path.join(process.cwd(),'jobs');
export const sourceMp4Path = path.join(JOBS_DIR, 'source.mp4');
export const audioMp3Path = path.join(JOBS_DIR, 'audio.mp3');
export const srtPath = path.join(JOBS_DIR, 'transcription.srt');

export function  VideoToTextRepository(){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);


};


export default VideoToTextRepository;
