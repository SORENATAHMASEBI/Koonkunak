
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('app-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
  
  // شبیه‌سازی لودینگ سنگین برای القای ابهت برنامه
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.2)';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 1000);
      }
    }, 3000); // 3 ثانیه مکث برای لودینگ
  });
}
