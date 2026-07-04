import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = express.Router();

const MockService = {
    readJson(fileName) {
        const filePath = path.join(__dirname, fileName);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    },
    getTestSearchList() {
        return this.readJson('testSearchList.json');
    },
    getTestVideoList() {
        return this.readJson('testVideo.json');
    },
    getTestChannelList() {
        return this.readJson('testChannel.json');
    },
};

router.get('/testSearchList', (req, res) => {
    res.json(MockService.getTestSearchList());
});

router.get('/testVideoList', (req, res) => {
    console.log('testVideoList query:', req.query);
    res.json(MockService.getTestVideoList());
});
router.get('/testChannelList', (req, res) => {
    res.json(MockService.getTestChannelList());
});

export default router;
