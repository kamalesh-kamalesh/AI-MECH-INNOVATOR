import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign dev environment WebSocket disconnect noise / Vite HMR rejections
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event.reason?.message || event.reason || '');
  if (reasonStr.includes('WebSocket') || reasonStr.includes('websocket')) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  const msgStr = String(event.message || '');
  if (msgStr.includes('WebSocket') || msgStr.includes('websocket')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


