import React from 'react';
import { createRoot } from 'react-dom/client';
import YoutubeDebugingUI from './YoutubeDebugingUI.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <YoutubeDebugingUI />
  </React.StrictMode>
);
