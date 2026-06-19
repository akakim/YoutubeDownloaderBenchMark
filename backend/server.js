import express from 'express';
import cors from 'cors';
import SSulFactoryRouter from './api/SSulFactoryRouter.js';
import ServiceRouter from './api/ServiceRouter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import UploadRouter from './uploads/UploadRouter.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load API key from openai.json
const openaiConfigPath = path.join(__dirname, '.', 'openai.json');
const openaiConfig = JSON.parse(fs.readFileSync(openaiConfigPath, 'utf8'));


const app = express();
const port = 3000;


// Enable CORS
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://yourdomain.com', 'https://www.yourdomain.com']  // 운영 도메인
//     : ['http://localhost:5173'],  // 개발 도메인
//   methods: ['GET', 'POST'],
//   credentials: true  // 필요 시 쿠키 허용
// }));

// Use SSulFactoryAPI routes
app.use('/api',express.json(), SSulFactoryRouter);
app.use('/api',express.json(), ServiceRouter);

app.use('/upload', UploadRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});