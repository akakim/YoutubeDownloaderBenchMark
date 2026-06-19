import v8 from "v8";

import fs from 'fs';
import path from 'path';

export const updateMetadataStatus = async(jobId, status) => {
  
    const JOBS_DIR = path.join(process.cwd(), 'backend', 'uploads', 'jobs');
    const result = {};
    const METADATA_PATH = path.join(JOBS_DIR, jobId, 'metadata.json');
    if (!fs.existsSync(METADATA_PATH)) {
        return {
            success: false,
            error: `Metadata file not found for jobId: ${jobId}`
        };
    }

    try {
        const data = await fs.promises.readFile(
            METADATA_PATH,
            'utf8'
        );

        const metadata = JSON.parse(data);

        metadata.status = status;
        metadata.updatedAt = new Date().toISOString();

        await fs.promises.writeFile(
            METADATA_PATH,
            JSON.stringify(metadata, null, 2),
            'utf8'
        );

        return {
            success: true
        };

    } catch (err) {
        return {
            success: false,
            error: `Error updating metadata: ${err}`
        };
    }



};

export const getFfmpegPath = () => {
  if (process.platform === 'win32') {
    return path.join(process.cwd(), 'backend', 'bin','ffmpeg-8.1.1-full_build','bin', 'ffmpeg.exe');
  } 



  return 'ffmpeg';
};

export const getHeapSize = () =>{
  const heapLimit = v8.getHeapStatistics().heap_size_limit;
  const usedHeap = process.memoryUsage().heapUsed;

  const ratio = usedHeap / heapLimit;

  if (ratio >= 0.5) {
    console.log("Memory usage > 50%, clearing transcriptStore");
  }

  return ratio 


}


export default updateMetadataStatus;