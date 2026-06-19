import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load API key from openai.json
const openaiConfigPath = path.join(__dirname, '..', 'openai.json');
const openaiConfig = JSON.parse(fs.readFileSync(openaiConfigPath, 'utf8'));




const openai_client = new OpenAI({
  apiKey: openaiConfig.apiKey,
});


const router = express.Router();



// POST endpoint for /insertPrompt
router.post('/insertPrompt', async (req, res) => {
  const { scenes } = req.body;

  if (!scenes || !Array.isArray(scenes)) {
    return res.status(400).json({ error: 'Invalid scenes data' });
  }

  // Process the scenes array
  console.log('from FrontEnd', req.body);
  console.log('Received scenes:', scenes);

  try {
    // Generate images for each scene
    const imagePromises = scenes.map(async (scene) => {
      const response = await openai_client.images.generate({
        prompt: scene.prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      });
      return {
        cut: scene.cut,
        situation: scene.situation,
        prompt: scene.prompt,
        image: response.data[0].b64_json
      };
    });

    const results = await Promise.all(imagePromises);

    res.json({ message: 'Images generated successfully', results });
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ error: 'Failed to generate images' });
  }
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
