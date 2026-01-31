
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('app-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
  
  // حذف لودینگ بعد از رندر شدن اولین فریم ری‌اکت
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => loader.remove(), 700);
    }
  }, 1500);
}
