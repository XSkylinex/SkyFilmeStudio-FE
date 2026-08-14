import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from '@/App';

const ROOT_ELEMENT_ID = 'root';

const container = document.getElementById(ROOT_ELEMENT_ID);

if (!container) {
  throw new Error(
    `Local AI Studio cannot mount: the document has no #${ROOT_ELEMENT_ID} element.`,
  );
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
