import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from '@/App';
import {
  DEFAULT_DOCUMENT_DIRECTION,
  DEFAULT_INTERFACE_LANGUAGE,
} from '@/shell/document-language.constants';
import { applyDocumentLanguage } from '@/shell/helpers/apply-document-language';

const ROOT_ELEMENT_ID = 'root';

const container = document.getElementById(ROOT_ELEMENT_ID);

if (!container) {
  throw new Error(
    `Local AI Studio cannot mount: the document has no #${ROOT_ELEMENT_ID} element.`,
  );
}

applyDocumentLanguage(DEFAULT_INTERFACE_LANGUAGE, DEFAULT_DOCUMENT_DIRECTION);

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
