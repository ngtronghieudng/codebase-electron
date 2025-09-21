import '@/renderer/assets/styles/root/tailwind.css';
import '@/renderer/assets/styles/root/main.scss';
import '@/renderer/libs/react-i18next/init';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

const app = createRoot(document.getElementById('root')!);

app.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
