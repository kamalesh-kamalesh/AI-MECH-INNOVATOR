import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  const isWsErr = (err: any) => {
    if (!err) return false;
    const str = String(err?.message || err?.reason || err || '').toLowerCase();
    return (
      str.includes('websocket') ||
      str.includes('ws://') ||
      str.includes('wss://') ||
      str.includes('closed without opened')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isWsErr(event.reason) || isWsErr(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (isWsErr(event.error) || isWsErr(event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

