import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Sikrer at root element findes
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// React 19 bruger createRoot API
const root = createRoot(rootElement);

// Render App komponenten
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);